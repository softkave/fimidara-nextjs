import { first, flattenDeep } from "lodash";
import {
  INewPermissionItemInput,
  IPermissionItem,
} from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import { makeKey } from "../../../../lib/utilities/fns";

/**
 * map: entity ID, type, and action -> item[]
 * sort: exclusion, everything else
 * can perform action: checks first of action and wildcard action
 *   and ensures they are not exclusion
 * grant permission: if can't perform action cause no item,
 *   add input item. if can't perform action cause of
 *   exclusion, delete exclusion and add item for access.
 * remove permission: delete all items for entity ID, type and action
 *   check for wildcard resource type and add exclusion item if found.
 */

export interface INewPermissionItemInputExt extends INewPermissionItemInput {
  isNew: boolean;
  resourceId?: string;
}

export type NewPermissionItemInputMap = Record<
  string,
  INewPermissionItemInputExt[]
>;

export default class PermissionItemsByResourceController {
  static getEntityActionKey(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    return makeKey([permissionEntityId, permissionEntityType, action]);
  }

  static makeInputList(item: IPermissionItem): INewPermissionItemInputExt {
    return {
      permissionEntityId: item.permissionEntityId,
      permissionEntityType: item.permissionEntityType,
      action: item.action,
      isExclusion: item.isExclusion,
      isForPermissionOwnerOnly: item.isForPermissionOwnerOnly,
      permissionOwnerId: item.permissionOwnerId,
      permissionOwnerType: item.permissionOwnerType,
      itemResourceType: item.itemResourceType,
      itemResourceId: item.itemResourceId,
      isNew: false,
      resourceId: item.resourceId,
    };
  }

  static indexItems(items: IPermissionItem[]) {
    const itemsMap: NewPermissionItemInputMap = {};
    items.forEach((item) => {
      const key = this.getEntityActionKey(
        item.permissionEntityId,
        item.permissionEntityType,
        item.action
      );

      const actionItemList = itemsMap[key] || [];
      actionItemList.push(
        PermissionItemsByResourceController.makeInputList(item)
      );

      itemsMap[key] = actionItemList;
    });

    return itemsMap;
  }

  static sortItems(itemsMap: NewPermissionItemInputMap) {
    for (const key in itemsMap) {
      const actionItemList = itemsMap[key];
      actionItemList.sort((item01, item02) => {
        if (item01.isExclusion) {
          return -1;
        } else if (item02.isExclusion) {
          return 1;
        }

        return 0;
      });
    }
  }

  static fromPermissionItems(
    inputItems: IPermissionItem[],
    permissionOwnerId: string,
    permissionOwnerType: AppResourceType,
    itemResourceType: AppResourceType,
    itemResourceId?: string
  ) {
    const itemsMap = PermissionItemsByResourceController.indexItems(inputItems);
    PermissionItemsByResourceController.sortItems(itemsMap);
    return new PermissionItemsByResourceController(
      itemsMap,
      permissionOwnerId,
      permissionOwnerType,
      itemResourceType,
      itemResourceId
    );
  }

  private itemsMap: NewPermissionItemInputMap;
  private permissionOwnerId: string;
  private permissionOwnerType: AppResourceType;
  private itemResourceId?: string;
  private itemResourceType: AppResourceType;
  private deletedItemIds: string[] = [];

  constructor(
    inputItems: NewPermissionItemInputMap,
    permissionOwnerId: string,
    permissionOwnerType: AppResourceType,
    itemResourceType: AppResourceType,
    itemResourceId?: string,
    deletedItemIds: string[] = []
  ) {
    this.itemsMap = inputItems;
    this.permissionOwnerId = permissionOwnerId;
    this.permissionOwnerType = permissionOwnerType;
    this.itemResourceId = itemResourceId;
    this.itemResourceType = itemResourceType;
    this.deletedItemIds = deletedItemIds;
  }

  public canPerformAction(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    const { actionItemList, wildcardActionItemList } =
      this.getEntityActionItemList(
        permissionEntityId,
        permissionEntityType,
        action
      );

    const actionItem = first(actionItemList);
    const wildcardActionItem = first(wildcardActionItemList);

    if (actionItem?.isExclusion || wildcardActionItem?.isExclusion) {
      return false;
    }

    return !!(actionItem || wildcardActionItem);
  }

  public grantPermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    const {
      actionItemList,
      wildcardActionItemList,
      actionItemKey,
      wildcardActionItemKey,
    } = this.getEntityActionItemList(
      permissionEntityId,
      permissionEntityType,
      action
    );

    const newActionItemList = this.removeExclusions(actionItemList);
    const newWildcardActionItemList = this.removeExclusions(
      wildcardActionItemList
    );

    const actionItem = first(actionItemList);
    const wildcardActionItem = first(wildcardActionItemList);

    if (!actionItem && !wildcardActionItem) {
      newActionItemList.unshift({
        action,
        permissionEntityId,
        permissionEntityType,
        permissionOwnerId: this.permissionOwnerId,
        permissionOwnerType: this.permissionOwnerType,
        isNew: true,
        itemResourceType: this.itemResourceType,
        itemResourceId: this.itemResourceId,
      });
    }

    const newItemsMap: NewPermissionItemInputMap = {};
    newItemsMap[actionItemKey] = newActionItemList;
    newItemsMap[wildcardActionItemKey] = newWildcardActionItemList;
    return new PermissionItemsByResourceController(
      newItemsMap,
      this.permissionOwnerId,
      this.permissionOwnerType,
      this.itemResourceType,
      this.itemResourceId,
      this.deletedItemIds
    );
  }

  public removePermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    if (
      !this.canPerformAction(permissionEntityId, permissionEntityType, action)
    ) {
      return this;
    }

    const {
      actionItemList,
      wildcardActionItemList,
      actionItemKey,
      wildcardActionItemKey,
    } = this.getEntityActionItemList(
      permissionEntityId,
      permissionEntityType,
      action
    );

    const newActionItemList = this.removeItemsForResource(actionItemList);
    const newWildcardActionItemList =
      action === BasicCRUDActions.All
        ? this.removeItemsForResource(wildcardActionItemList)
        : wildcardActionItemList;

    if (
      newActionItemList.length !== 0 ||
      newWildcardActionItemList.length !== 0
    ) {
      newActionItemList.unshift({
        action,
        permissionEntityId,
        permissionEntityType,
        permissionOwnerId: this.permissionOwnerId,
        permissionOwnerType: this.permissionOwnerType,
        isExclusion: true,
        isNew: true,
        itemResourceType: this.itemResourceType,
        itemResourceId: this.itemResourceId,
      });
    }

    const newItemsMap: NewPermissionItemInputMap = {};
    newItemsMap[actionItemKey] = newActionItemList;
    newItemsMap[wildcardActionItemKey] = newWildcardActionItemList;
    return new PermissionItemsByResourceController(
      newItemsMap,
      this.permissionOwnerId,
      this.permissionOwnerType,
      this.itemResourceType,
      this.itemResourceId,
      this.deletedItemIds
    );
  }

  public togglePermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions,
    permitted: boolean
  ) {
    return permitted
      ? this.grantPermission(permissionEntityId, permissionEntityType, action)
      : this.removePermission(permissionEntityId, permissionEntityType, action);
  }

  public getItems() {
    return flattenDeep(Object.values(this.itemsMap));
  }

  public getDeletedItemIds() {
    return this.deletedItemIds;
  }

  private removeExclusions(itemList: INewPermissionItemInputExt[]) {
    return itemList.filter((item) => {
      if (!item.isExclusion) {
        return true;
      } else if (item.resourceId) {
        this.deletedItemIds.push(item.resourceId);
      }
    });
  }

  private removeItemsForResource(itemList: INewPermissionItemInputExt[]) {
    return itemList.filter((item) => {
      const isForResource =
        item.itemResourceId == this.itemResourceId && // we want null == undefined
        item.itemResourceType === this.itemResourceType;

      if (!isForResource) {
        return true;
      } else if (item.resourceId) {
        this.deletedItemIds.push(item.resourceId);
      }
    });
  }

  private getEntityActionItemList(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    const actionItemKey =
      PermissionItemsByResourceController.getEntityActionKey(
        permissionEntityId,
        permissionEntityType,
        action
      );

    const wildcardActionItemKey =
      PermissionItemsByResourceController.getEntityActionKey(
        permissionEntityId,
        permissionEntityType,
        BasicCRUDActions.All
      );

    const actionItemList = this.itemsMap[actionItemKey] || [];
    const wildcardActionItemList = this.itemsMap[wildcardActionItemKey] || [];
    return {
      actionItemList,
      wildcardActionItemList,
      actionItemKey,
      wildcardActionItemKey,
    };
  }
}
