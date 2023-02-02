import {
  INewPermissionGroupInput,
  IPermissionGroup,
  IUpdatePermissionGroupInput,
} from "../../definitions/permissionGroups";
import {
  GetEndpointResult,
  IEndpointResultBase,
  IPaginationQuery,
} from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/v1/permissionGroups";
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

export interface IGetWorkspacePermissionGroupEndpointParams
  extends IPaginationQuery {
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
  static addPermissionGroup = addPermissionGroup;
  static getWorkspacePermissionGroups = getWorkspacePermissionGroups;
  static getPermissionGroup = getPermissionGroup;
  static deletePermissionGroup = deletePermissionGroup;
  static updatePermissionGroup = updatePermissionGroup;
}

export class PermissionGroupURL {
  static addPermissionGroup = addPermissionGroupURL;
  static getWorkspacePermissionGroups = getWorkspacePermissionGroupsURL;
  static getPermissionGroup = getPermissionGroupURL;
  static deletePermissionGroup = deletePermissionGroupURL;
  static updatePermissionGroup = updatePermissionGroupURL;
}
