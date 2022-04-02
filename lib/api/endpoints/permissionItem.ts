import { IPermissionItem } from "../../definitions/permissionItem";
import { AppResourceType, BasicCRUDActions } from "../../definitions/system";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/permissionItems";
const addItemsURL = `${baseURL}/addItems`;
const deleteItemsByIdURL = `${baseURL}/deleteItemsById`;
const getEntityPermissionItemsURL = `${baseURL}/getEntityPermissionItems`;
const getResourcePermissionItemsURL = `${baseURL}/getResourcePermissionItems`;

export interface INewPermissionItemInput {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
  isExclusion?: boolean;
  isForPermissionOwnerOnly?: boolean;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  isWildcardResourceType: boolean;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
}

export interface IAddPermissionItemsEndpointParams {
  organizationId: string;
  items: INewPermissionItemInput[];
}

export type IAddPermissionItemsEndpointResult = GetEndpointResult<{
  items: IPermissionItem[];
}>;

async function addItems(props: IAddPermissionItemsEndpointParams) {
  return invokeEndpointWithAuth<IAddPermissionItemsEndpointResult>({
    path: addItemsURL,
    data: props,
  });
}

export interface IDeletePermissionItemsByIdEndpointParams {
  organizationId: string;
  itemIds: string[];
}

async function deleteItemsById(
  props: IDeletePermissionItemsByIdEndpointParams
) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteItemsByIdURL,
    data: props,
  });
}

export interface IGetEntityPermissionItemsEndpointParams {
  organizationId: string;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
}

export type IGetEntityPermissionItemsEndpointResult = GetEndpointResult<{
  items: IPermissionItem[];
}>;

async function getEntityPermissionItems(
  props: IGetEntityPermissionItemsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetEntityPermissionItemsEndpointResult>({
    path: getEntityPermissionItemsURL,
    data: props,
  });
}

export interface IGetResourcePermissionItemsEndpointParams {
  organizationId: string;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  permissionOwnerId?: string;
  permissionOwnerType?: AppResourceType;
}

export type IGetResourcePermissionItemsEndpointResult = GetEndpointResult<{
  items: IPermissionItem[];
}>;

async function getResourcePermissionItems(
  props: IGetResourcePermissionItemsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetResourcePermissionItemsEndpointResult>(
    {
      path: getResourcePermissionItemsURL,
      data: props,
    }
  );
}

export default class PermissionItemAPI {
  public static addItems = addItems;
  public static deleteItemsById = deleteItemsById;
  public static getResourcePermissionItems = getResourcePermissionItems;
  public static getEntityPermissionItems = getEntityPermissionItems;
}

export class PermissionItemURLs {
  public static addItems = addItemsURL;
  public static deleteItemsById = deleteItemsByIdURL;
  public static getResourcePermissionItems = getResourcePermissionItemsURL;
  public static getEntityPermissionItems = getEntityPermissionItemsURL;
}
