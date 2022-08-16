import {AppResourceType, BasicCRUDActions, IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Permission item */
export enum PermissionItemAppliesTo {
  /** The permission applies only to the permission item owner. For example, if
   * the permission targets a workspace, the permission will only grant or deny
   * access to only the workspace, and not it's chilren resources, like the
   * files and folders within. */
  Owner = 'owner',

  /** The permission applies to the permission owner and it's children
   * resources. For example, if the permission targets a workspace, the
   * permission will only grant or deny access to both the workspace, and it's
   * chilren resources, like the files and folders within. */
  OwnerAndChildren = 'owner-and-children',

  /** The permission applies only to the permission owner's children resources.
   * For example, if the permission targets a workspace, the permission will
   * only grant or deny access to only it's chilren resources, like the files
   * and folders within and not the workspace itself.*/
  Children = 'children',
}

/** @category Permission item */
export interface IPermissionItem {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;

  /**
   * The permission owner is the container resource that the permission item
   * applies to. For example, if the permission targets a folder, the permission
   * will only grant or deny access to the folder, and it's chilren resources,
   * like the files and folders within depending on the value of the `appliesTo`
   * field. This permission item will not be considered when evaluating an
   * access request for a sibling or parent folder.
   *
   * Currently, there are 3 permission owner types,
   * {@link AppResourceType.Workspace}, {@link AppResourceType.Folder}, and
   * {@link AppResourceType.File}. If the type is
   * {@link AppResourceType.Workspace}, `permissionOwnerId` will be the
   * workspace's ID, if the type is {@link AppResourceType.Folder},
   * `permissionOwnerId` will be the folder's ID, and if the type is
   * {@link AppResourceType.File}, `permissionOwnerId` will be the file's ID.
   */
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;

  /**
   * A permission entity is the resource type the permission item grants or
   * denies access on behalf of. For example, if the permission belongs to a
   * permission group named `MyPermissionGroup`, the permission will only grant
   * or deny access to agents (users, client tokens, and program tokens) that
   * have been assigned the permission group. When evaluating an access request
   * on behalf of an agent that has not been assigned the permission group, the
   * permission item will not be considered.
   *
   * Currently, there are 4 permission entity types,
   * {@link AppResourceType.User}, {@link AppResourceType.ProgramAccessToken},
   * {@link AppResourceType.ClientAssignedToken}, and
   * {@link AppResourceType.PermissionGroup}. If the type is
   * {@link AppResourceType.User}, `permissionEntityId` will be the user's ID,
   * if the type is {@link AppResourceType.ProgramAccessToken},
   * `permissionEntityId` will be the token's ID, if the type is
   * {@link AppResourceType.ClientAssignedToken}, `permissionEntityId` will be
   * the token's ID, and if the type is {@link AppResourceType.PermissionGroup},
   * `permissionEntityId` will be the permission group's ID.
   */
  permissionEntityId: string;
  permissionEntityType: AppResourceType;

  /**
   * The item resource is the resource the permission item grants or denies
   * access to. Must be a resource that belongs to or that is a child of the
   * permission owner. For example, if the permission owner is a folder, the
   * item resource can be a file or a folder within the folder.
   *
   * If `itemResourceId` is not specified, the permission item will apply to all
   * the resources of type `itemResourceType` that belong to the permission
   * owner. If it is specified, the permission item will apply to the resource
   * with the specified ID of the specified type.
   */
  itemResourceId?: string;
  itemResourceType: AppResourceType;

  /** The action that the permission item grants or denies access to. */
  action: BasicCRUDActions;

  /** Whether the permission item grants or denies access to the permission
   * entity. */
  grantAccess: boolean;

  /** Whether permission item applies to the permission owner and or it's
   * children resources. */
  appliesTo: PermissionItemAppliesTo;
}

/** @category Permission item */
export interface INewPermissionItemInput {
  /** @see {@link IPermissionItem#permissionEntityId} */
  permissionEntityId: string;
  permissionEntityType: AppResourceType;

  /** @see {@link IPermissionItem#permissionOwnerId} */
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;

  /** @see {@link IPermissionItem#itemResourceId} */
  itemResourceId?: string;
  itemResourceType: AppResourceType;

  /** @see {@link IPermissionItem#action} */
  action: BasicCRUDActions;

  /** @see {@link IPermissionItem#grantAccess} */
  grantAccess: boolean;

  /** @see {@link IPermissionItem#appliesTo} */
  appliesTo: PermissionItemAppliesTo;
}

/** @category Permission item */
export interface IAddPermissionItemsEndpointParams extends IEndpointParamsBase {
  items: INewPermissionItemInput[];
}

/** @category Permission item */
export interface IAddPermissionItemsEndpointResult extends IEndpointResultBase {
  items: IPermissionItem[];
}

/** @category Permission item */
export interface IDeletePermissionItemsByIdEndpointParams
  extends IEndpointParamsBase {
  itemIds: string[];
}

/** @category Permission item */
export interface IGetEntityPermissionItemsEndpointParams
  extends IEndpointParamsBase {
  /** @see {@link IPermissionItem#permissionEntityId} */
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
}

/** @category Permission item */
export interface IGetEntityPermissionItemsEndpointResult
  extends IEndpointResultBase {
  items: IPermissionItem[];
}

/** @category Permission item */
export interface IGetResourcePermissionItemsEndpointParams
  extends IEndpointParamsBase {
  /** @see {@link IPermissionItem#itemResourceId} */
  itemResourceId?: string;
  itemResourceType: AppResourceType;

  /** @see {@link IPermissionItem#permissionOwnerId} */
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
}

/** @category Permission item */
export interface IGetResourcePermissionItemsEndpointResult
  extends IEndpointResultBase {
  items: IPermissionItem[];
}

/** @category Permission item */
export interface INewPermissionItemInputByEntity {
  /** @see {@link IPermissionItem#permissionOwnerId} */
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;

  /** @see {@link IPermissionItem#itemResourceId} */
  itemResourceId?: string;
  itemResourceType: AppResourceType;

  /** @see {@link IPermissionItem#action} */
  action: BasicCRUDActions;

  /** @see {@link IPermissionItem#grantAccess} */
  grantAccess: boolean;

  /** @see {@link IPermissionItem#appliesTo} */
  appliesTo: PermissionItemAppliesTo;
}

/** @category Permission item */
export interface IReplacePermissionItemsByEntityEndpointParams
  extends IEndpointParamsBase {
  /** @see {@link IPermissionItem#permissionEntityId} */
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  items: INewPermissionItemInputByEntity[];
}

/** @category Permission item */
export interface IReplacePermissionItemsByEntityEndpointResult {
  items: IPermissionItem[];
}

/** @category Permission item */
export interface IPermissionItemEndpoints {
  addItems(
    props: IAddPermissionItemsEndpointParams
  ): Promise<IAddPermissionItemsEndpointResult>;
  deleteItemsById(
    props: IDeletePermissionItemsByIdEndpointParams
  ): Promise<IEndpointResultBase>;

  /** Returns all the permission items that grant or deny access to the
   * resource. */
  getResourcePermissionItems(
    props: IGetResourcePermissionItemsEndpointParams
  ): Promise<IGetResourcePermissionItemsEndpointResult>;

  /** Returns all the permission items that directly belong to the entity. */
  getEntityPermissionItems(
    props: IGetEntityPermissionItemsEndpointParams
  ): Promise<IGetEntityPermissionItemsEndpointResult>;
  replacePermissionItemsByEntity(
    props: IReplacePermissionItemsByEntityEndpointParams
  ): Promise<IReplacePermissionItemsByEntityEndpointResult>;
}

/**
 * @category Permission item
 * @description
 * Utility functions for making permission item inputs from a list of actions
 **/
export function makePermissionItemInputWithActions<T>(
  item: Omit<T, 'action'>,
  actions: BasicCRUDActions[] = [
    BasicCRUDActions.Create,
    BasicCRUDActions.Read,
    BasicCRUDActions.Update,
    BasicCRUDActions.Delete,
  ]
) {
  return actions.map(action => ({...item, action}));
}
