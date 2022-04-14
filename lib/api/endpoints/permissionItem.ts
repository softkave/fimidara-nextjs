import {
  INewPermissionItemInput,
  IPermissionItem,
} from "../../definitions/permissionItem";
import { AppResourceType } from "../../definitions/system";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/permissionItems";
const addItemsURL = `${baseURL}/addItems`;
const deleteItemsByIdURL = `${baseURL}/deleteItemsById`;
const getEntityPermissionItemsURL = `${baseURL}/getEntityPermissionItems`;
const getResourcePermissionItemsURL = `${baseURL}/getResourcePermissionItems`;

export interface IAddPermissionItemsEndpointParams {
  workspaceId: string;
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
  workspaceId: string;
  itemIds: string[];
}

async function deleteItemsById(
  props: IDeletePermissionItemsByIdEndpointParams
) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteItemsByIdURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetEntityPermissionItemsEndpointParams {
  workspaceId: string;
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
  workspaceId: string;
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
