import {
  INewPermissionGroupInput,
  IPermissionGroup,
  IUpdatePermissionGroupInput,
} from "../../definitions/permissionGroups";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/permissionGroups";
const addPermissionGroupURL = `${baseURL}/addPermissionGroup`;
const getWorkspacePermissionGroupsURL = `${baseURL}/getWorkspacePermissionGroups`;
const getPermissionGroupURL = `${baseURL}/getPermissionGroup`;
const deletePermissionGroupURL = `${baseURL}/deletePermissionGroup`;
const updatePermissionGroupURL = `${baseURL}/updatePermissionGroup`;

export interface IAddPermissionGroupEndpointParams {
  workspaceId: string;
  permissionGroup: INewPermissionGroupInput;
}

export type IAddPermissionGroupEndpointResult = GetEndpointResult<{
  permissionGroup: IPermissionGroup;
}>;

async function addPermissionGroup(props: IAddPermissionGroupEndpointParams) {
  return invokeEndpointWithAuth<IAddPermissionGroupEndpointResult>({
    path: addPermissionGroupURL,
    data: props,
  });
}

export interface IDeletePermissionGroupEndpointParams {
  permissionGroupId: string;
}

async function deletePermissionGroup(
  props: IDeletePermissionGroupEndpointParams
) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deletePermissionGroupURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetWorkspacePermissionGroupEndpointParams {
  workspaceId: string;
}

export type IGetWorkspacePermissionGroupEndpointResult = GetEndpointResult<{
  permissionGroups: IPermissionGroup[];
}>;

async function getWorkspacePermissionGroups(
  props: IGetWorkspacePermissionGroupEndpointParams
) {
  return await invokeEndpointWithAuth<IGetWorkspacePermissionGroupEndpointResult>(
    {
      path: getWorkspacePermissionGroupsURL,
      data: props,
    }
  );
}

export interface IGetPermissionGroupEndpointParams {
  permissionGroupId: string;
}

export type IGetPermissionGroupEndpointResult = GetEndpointResult<{
  permissionGroup: IPermissionGroup;
}>;

async function getPermissionGroup(props: IGetPermissionGroupEndpointParams) {
  return await invokeEndpointWithAuth<IGetPermissionGroupEndpointResult>({
    path: getPermissionGroupURL,
    data: props,
  });
}

export interface IUpdatePermissionGroupEndpointParams {
  permissionGroupId: string;
  permissionGroup: IUpdatePermissionGroupInput;
}

export type IUpdatePermissionGroupEndpointResult = GetEndpointResult<{
  permissionGroup: IPermissionGroup;
}>;

async function updatePermissionGroup(
  props: IUpdatePermissionGroupEndpointParams
) {
  return await invokeEndpointWithAuth<IUpdatePermissionGroupEndpointResult>({
    path: updatePermissionGroupURL,
    data: props,
  });
}

export default class PermissionGroupAPI {
  public static addPermissionGroup = addPermissionGroup;
  public static getWorkspacePermissionGroups = getWorkspacePermissionGroups;
  public static getPermissionGroup = getPermissionGroup;
  public static deletePermissionGroup = deletePermissionGroup;
  public static updatePermissionGroup = updatePermissionGroup;
}

export class PermissionGroupURL {
  public static addPermissionGroup = addPermissionGroupURL;
  public static getWorkspacePermissionGroups = getWorkspacePermissionGroupsURL;
  public static getPermissionGroup = getPermissionGroupURL;
  public static deletePermissionGroup = deletePermissionGroupURL;
  public static updatePermissionGroup = updatePermissionGroupURL;
}
