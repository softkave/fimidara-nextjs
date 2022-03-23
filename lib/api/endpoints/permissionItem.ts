import { IPermissionItem } from "../../definitions/permissionItem";
import { AppResourceType, BasicCRUDActions } from "../../definitions/system";
import { GetEndpointResult } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/permissionItems";
const replaceItemsByResourceURL = `${baseURL}/replaceItemsByResource`;
const getEntityPermissionItemsURL = `${baseURL}/getEntityPermissionItems`;
const getResourcePermissionItemsURL = `${baseURL}/getResourcePermissionItems`;

export interface INewPermissionItemInputByResource {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
  isExclusion?: boolean;
  isForPermissionOwnerOnly?: boolean;
}

export interface IReplacePermissionItemsByResourceEndpointParams {
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  organizationId: string;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  items: INewPermissionItemInputByResource[];
}

export type IReplacePermissionItemsByResourceEndpointResult =
  GetEndpointResult<{
    items: IPermissionItem[];
  }>;

async function replaceItemsByResource(
  props: IReplacePermissionItemsByResourceEndpointParams
) {
  return invokeEndpointWithAuth<IReplacePermissionItemsByResourceEndpointResult>(
    {
      path: replaceItemsByResourceURL,
      data: props,
    }
  );
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
  public static replaceItemsByResource = replaceItemsByResource;
  public static getResourcePermissionItems = getResourcePermissionItems;
  public static getEntityPermissionItems = getEntityPermissionItems;
}

export class PermissionItemURLs {
  public static replaceItemsByResource = replaceItemsByResourceURL;
  public static getResourcePermissionItems = getResourcePermissionItemsURL;
  public static getEntityPermissionItems = getEntityPermissionItemsURL;
}
