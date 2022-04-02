import { first, flattenDeep } from "lodash";
import { INewPermissionItemInputByResource } from "../../../../lib/api/endpoints/permissionItem";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import { makeKey } from "../../../../lib/utilities/fns";

/**
 * map: entity ID, type, and action -> item[]
 * sort: exclusion, resource ID & type, wildcard
 * can perform action: checks first of action and wildcard action
 *   and ensures they are exclusion if true
 * grant permission: if can't perform action cause no item,
 *   add input item with resource ID, type, action, entity ID, type,
 *   permission owner ID, and type. if can't perform action cause of
 *   exclusion, delete exclusion and add item for access.
 * remove permission: delete all items for entity ID, type and action
 *   check for wildcard resource type and add exclusion item if found.
 */

export type NewPermissionItemInputByResourceMap = Record<
  string,
  INewPermissionItemInputByResource[]
>;

export default class PermissionItemsController {
  static getEntityActionKey(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    return makeKey([permissionEntityId, permissionEntityType, action]);
  }

  static makeInputList(item: IPermissionItem) {
    return {
      permissionEntityId: item.permissionEntityId,
      permissionEntityType: item.permissionEntityType,
      action: item.action,
      isExclusion: item.isExclusion,
      isForPermissionOwnerOnly: item.isForPermissionOwnerOnly,
      permissionOwnerId: item.permissionOwnerId,
      permissionOwnerType: item.permissionOwnerType,
      isWildcardResourceType: item.itemResourceType === AppResourceType.All,
    };
  }

  static indexItems(items: IPermissionItem[]) {
    const itemsMap: NewPermissionItemInputByResourceMap = {};
    items.forEach((item) => {
      const key = this.getEntityActionKey(
        item.permissionEntityId,
        item.permissionEntityType,
        item.action
      );

      const actionItemList = itemsMap[key] || [];
      actionItemList.push(PermissionItemsController.makeInputList(item));
      itemsMap[key] = actionItemList;
    });

    return itemsMap;
  }

  static sortItems(itemsMap: NewPermissionItemInputByResourceMap) {
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
    permissionOwnerType: AppResourceType
  ) {
    const itemsMap = PermissionItemsController.indexItems(inputItems);
    PermissionItemsController.sortItems(itemsMap);
    return new PermissionItemsController(
      itemsMap,
      permissionOwnerId,
      permissionOwnerType
    );
  }

  private itemsMap: NewPermissionItemInputByResourceMap;
  private permissionOwnerId: string;
  private permissionOwnerType: AppResourceType;

  constructor(
    inputItems: NewPermissionItemInputByResourceMap,
    permissionOwnerId: string,
    permissionOwnerType: AppResourceType
  ) {
    this.itemsMap = inputItems;
    this.permissionOwnerId = permissionOwnerId;
    this.permissionOwnerType = permissionOwnerType;
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
        isWildcardResourceType: true,
      });
    }

    const newItemsMap: NewPermissionItemInputByResourceMap = {};
    newItemsMap[actionItemKey] = newActionItemList;
    newItemsMap[wildcardActionItemKey] = newWildcardActionItemList;
    return new PermissionItemsController(
      newItemsMap,
      this.permissionOwnerId,
      this.permissionOwnerType
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
        : [...wildcardActionItemList];

    newActionItemList.unshift({
      action,
      permissionEntityId,
      permissionEntityType,
      permissionOwnerId: this.permissionOwnerId,
      permissionOwnerType: this.permissionOwnerType,
      isWildcardResourceType: false,
      isExclusion: true,
    });

    const newItemsMap: NewPermissionItemInputByResourceMap = {};
    newItemsMap[actionItemKey] = newActionItemList;
    newItemsMap[wildcardActionItemKey] = newWildcardActionItemList;
    return new PermissionItemsController(
      newItemsMap,
      this.permissionOwnerId,
      this.permissionOwnerType
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

  private removeExclusions(itemList: INewPermissionItemInputByResource[]) {
    return itemList.filter((item) => !item.isExclusion);
  }

  private removeItemsForResource(
    itemList: INewPermissionItemInputByResource[]
  ) {
    return itemList.filter((item) => item.isWildcardResourceType);
  }

  private getEntityActionItemList(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    const actionItemKey = PermissionItemsController.getEntityActionKey(
      permissionEntityId,
      permissionEntityType,
      action
    );

    const wildcardActionItemKey = PermissionItemsController.getEntityActionKey(
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
