import {
  INewPermissionItemInput,
  IPermissionItem,
} from "../../definitions/permissionItem";
import { AppResourceType } from "../../definitions/system";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/permissionItems";

export interface IAddPermissionItemsEndpointParams {
  organizationId: string;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  items: INewPermissionItemInput[];
}

export type IAddPermissionItemsEndpointResult = GetEndpointResult<{
  items: IPermissionItem[];
}>;

async function addItems(props: IAddPermissionItemsEndpointParams) {
  return invokeEndpointWithAuth<IAddPermissionItemsEndpointResult>({
    path: `${baseURL}/addItems`,
    data: props,
  });
}

export interface IDeletePermissionItemsEndpointParams {
  organizationId: string;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  itemIds: string[];
}

async function deleteItems(props: IDeletePermissionItemsEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteToken`,
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
    path: `${baseURL}/getEntityPermissionItems`,
    data: props,
  });
}

export default class PermissionItemAPI {
  public static addItems = addItems;
  public static deleteItems = deleteItems;
  public static getEntityPermissionItems = getEntityPermissionItems;
}
