import { first, flattenDeep } from "lodash";
import {
  INewPermissionItemInput,
  IPermissionItem,
  PermissionItemAppliesTo,
} from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  BasicCRUDActions,
  getActions,
} from "../../../../lib/definitions/system";
import { makeKey } from "../../../../lib/utilities/fns";

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
      grantAccess: item.grantAccess,
      appliesTo: item.appliesTo,
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
        if (item01.grantAccess) {
          return -1;
        } else if (item02.grantAccess) {
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
    appliesTo: PermissionItemAppliesTo,
    itemResourceId?: string
  ) {
    const itemsMap = PermissionItemsByResourceController.indexItems(inputItems);
    PermissionItemsByResourceController.sortItems(itemsMap);
    return new PermissionItemsByResourceController(
      itemsMap,
      permissionOwnerId,
      permissionOwnerType,
      itemResourceType,
      appliesTo,
      itemResourceId
    );
  }

  private itemsMap: NewPermissionItemInputMap;
  private permissionOwnerId: string;
  private permissionOwnerType: AppResourceType;
  private itemResourceId?: string;
  private itemResourceType: AppResourceType;
  private deletedItemIds: string[] = [];
  private appliesTo: PermissionItemAppliesTo;

  constructor(
    inputItems: NewPermissionItemInputMap,
    permissionOwnerId: string,
    permissionOwnerType: AppResourceType,
    itemResourceType: AppResourceType,
    appliesTo: PermissionItemAppliesTo,
    itemResourceId?: string,
    deletedItemIds?: string[]
  ) {
    this.itemsMap = inputItems;
    this.permissionOwnerId = permissionOwnerId;
    this.permissionOwnerType = permissionOwnerType;
    this.itemResourceId = itemResourceId;
    this.itemResourceType = itemResourceType;
    this.deletedItemIds = deletedItemIds || [];
    this.appliesTo = appliesTo;
  }

  canPerformAction(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    if (action === BasicCRUDActions.All) {
      for (const nextAction of getActions(this.itemResourceType)) {
        if (nextAction === BasicCRUDActions.All) {
          continue;
        }

        const hasAccess = this.actionCheckFunc(
          permissionEntityId,
          permissionEntityType,
          nextAction
        );

        if (!hasAccess) {
          return false;
        }
      }

      return true;
    } else {
      return this.actionCheckFunc(
        permissionEntityId,
        permissionEntityType,
        action
      );
    }
  }

  grantPermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    let hasAccess = this.canPerformAction(
      permissionEntityId,
      permissionEntityType,
      action
    );

    if (hasAccess) {
      return this;
    }

    if (action === BasicCRUDActions.All) {
      const actionRemoveExclusionFunc = (actionParam: BasicCRUDActions) => {
        const { actionItemList, actionItemKey } = this.getActionItemList(
          permissionEntityId,
          permissionEntityType,
          actionParam
        );

        const newActionItemList = this.removeExclusions(actionItemList);
        this.itemsMap[actionItemKey] = newActionItemList;
      };

      const addPermissionFunc = (actionParam: BasicCRUDActions) => {
        const { actionItemList } = this.getActionItemList(
          permissionEntityId,
          permissionEntityType,
          actionParam
        );

        actionItemList.unshift({
          permissionEntityId,
          permissionEntityType,
          action: actionParam,
          permissionOwnerId: this.permissionOwnerId,
          permissionOwnerType: this.permissionOwnerType,
          isNew: true,
          itemResourceType: this.itemResourceType,
          itemResourceId: this.itemResourceId,
          appliesTo: this.appliesTo,
          grantAccess: true,
        });
      };

      const addPermissionForEveryActionFunc = () => {
        getActions(this.itemResourceType).forEach((nextAction) => {
          if (nextAction !== BasicCRUDActions.All) {
            addPermissionFunc(nextAction);
          }
        });
      };

      Object.values(BasicCRUDActions).forEach((nextAction) => {
        actionRemoveExclusionFunc(nextAction);
      });

      getActions(this.itemResourceType, true).forEach((nextAction) => {
        if (
          !this.actionCheckFunc(
            permissionEntityId,
            permissionEntityType,
            nextAction
          )
        ) {
          if (nextAction === BasicCRUDActions.All) {
            addPermissionForEveryActionFunc();
          } else {
            addPermissionFunc(nextAction);
          }
        }
      });
    } else {
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
          appliesTo: this.appliesTo,
          grantAccess: true,
        });
      }

      this.itemsMap[wildcardActionItemKey] = newWildcardActionItemList;
      this.itemsMap[actionItemKey] = newActionItemList;
    }

    return this.getNewController();
  }

  removePermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions
  ) {
    let hasAccess = this.canPerformAction(
      permissionEntityId,
      permissionEntityType,
      action
    );

    if (!hasAccess) {
      return this;
    }

    if (action === BasicCRUDActions.All) {
      const actionClearFunc = (actionParam: BasicCRUDActions) => {
        const { actionItemList, actionItemKey } = this.getActionItemList(
          permissionEntityId,
          permissionEntityType,
          actionParam
        );

        const newActionItemList = this.removePermissionsForResource(
          actionItemList,
          actionParam
        );

        this.itemsMap[actionItemKey] = newActionItemList;
      };

      const addExclusionFunc = (actionParam: BasicCRUDActions) => {
        const { actionItemList } = this.getActionItemList(
          permissionEntityId,
          permissionEntityType,
          actionParam
        );

        actionItemList.unshift({
          permissionEntityId,
          permissionEntityType,
          action: actionParam,
          permissionOwnerId: this.permissionOwnerId,
          permissionOwnerType: this.permissionOwnerType,
          grantAccess: false,
          isNew: true,
          itemResourceType: this.itemResourceType,
          itemResourceId: this.itemResourceId,
          appliesTo: this.appliesTo,
        });
      };

      const addExclusionForAllActionsFunc = () => {
        getActions(this.itemResourceType).forEach((nextAction) => {
          if (action !== BasicCRUDActions.All) {
            addExclusionFunc(nextAction);
          }
        });
      };

      Object.values(BasicCRUDActions).forEach((nextAction) => {
        actionClearFunc(nextAction);
      });

      getActions(this.itemResourceType, true).forEach((nextAction) => {
        if (
          this.actionCheckFunc(
            permissionEntityId,
            permissionEntityType,
            nextAction
          )
        ) {
          if (nextAction === BasicCRUDActions.All) {
            addExclusionForAllActionsFunc();
          } else {
            addExclusionFunc(nextAction);
          }
        }
      });
    } else {
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

      const newActionItemList = this.removePermissionsForResource(
        actionItemList,
        action
      );

      const newWildcardActionItemList = this.removePermissionsForResource(
        wildcardActionItemList,
        action
      );

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
          grantAccess: false,
          isNew: true,
          itemResourceType: this.itemResourceType,
          itemResourceId: this.itemResourceId,
          appliesTo: this.appliesTo,
        });
      }

      this.itemsMap[wildcardActionItemKey] = newWildcardActionItemList;
      this.itemsMap[actionItemKey] = newActionItemList;
    }

    return this.getNewController();
  }

  togglePermission(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions,
    permitted: boolean
  ) {
    return permitted
      ? this.grantPermission(permissionEntityId, permissionEntityType, action)
      : this.removePermission(permissionEntityId, permissionEntityType, action);
  }

  getItems() {
    return flattenDeep(Object.values(this.itemsMap));
  }

  getNewItems() {
    return this.getItems().filter((item) => item.isNew);
  }

  getDeletedItemIds() {
    return this.deletedItemIds;
  }

  private removeExclusions(itemList: INewPermissionItemInputExt[]) {
    return itemList.filter((item) => {
      const isForResource =
        item.itemResourceId == this.itemResourceId && // we want null == undefined
        item.itemResourceType === this.itemResourceType;

      if (!item.grantAccess && isForResource) {
        if (item.resourceId) {
          this.deletedItemIds.push(item.resourceId);
        }

        return false;
      }

      return true;
    });
  }

  private removePermissionsForResource(
    itemList: INewPermissionItemInputExt[],
    action: BasicCRUDActions
  ) {
    return itemList.filter((item) => {
      const isForResource =
        item.itemResourceId == this.itemResourceId && // we want null == undefined
        item.itemResourceType === this.itemResourceType;

      if (!isForResource || item.action !== action) {
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

  private getActionItemList(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    actionParam: BasicCRUDActions
  ) {
    const actionItemKey =
      PermissionItemsByResourceController.getEntityActionKey(
        permissionEntityId,
        permissionEntityType,
        actionParam
      );

    const actionItemList = this.itemsMap[actionItemKey] || [];
    return { actionItemList, actionItemKey };
  }

  private actionCheckFunc(
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    actionParam: BasicCRUDActions
  ) {
    const { actionItemList } = this.getActionItemList(
      permissionEntityId,
      permissionEntityType,
      actionParam
    );

    const actionItem = first(actionItemList);
    return actionItem?.grantAccess;
  }

  private getNewController() {
    return new PermissionItemsByResourceController(
      this.itemsMap,
      this.permissionOwnerId,
      this.permissionOwnerType,
      this.itemResourceType,
      this.appliesTo,
      this.itemResourceId,
      this.deletedItemIds
    );
  }
}
