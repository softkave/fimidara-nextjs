import {
  INewWorkspaceInput,
  IRequestWorkspace,
  IUpdateWorkspaceInput,
  IWorkspace,
} from "../../definitions/workspace";
import {
  GetEndpointResult,
  IEndpointResultBase,
  IPaginationQuery,
} from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/v1/workspaces";
const addWorkspaceURL = `${baseURL}/addWorkspace`;
const deleteWorkspaceURL = `${baseURL}/deleteWorkspace`;
const getWorkspaceURL = `${baseURL}/getWorkspace`;
const getRequestWorkspaceURL = `${baseURL}/getRequestWorkspace`;
const getUserWorkspacesURL = `${baseURL}/getUserWorkspaces`;
const updateWorkspaceURL = `${baseURL}/updateWorkspace`;

export type IAddWorkspaceEndpointParams = INewWorkspaceInput;
export type IAddWorkspaceEndpointResult = GetEndpointResult<{
  workspace: IWorkspace;
}>;

async function addWorkspace(props: IAddWorkspaceEndpointParams) {
  return invokeEndpointWithAuth<IAddWorkspaceEndpointResult>({
    path: addWorkspaceURL,
    data: props,
  });
}

export interface IDeleteWorkspaceEndpointParams {
  workspaceId: string;
}

async function deleteWorkspace(props: IDeleteWorkspaceEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteWorkspaceURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetWorkspaceEndpointParams {
  workspaceId: string;
}

export type IGetWorkspaceEndpointResult = GetEndpointResult<{
  workspace: IWorkspace;
}>;

async function getWorkspace(props: IGetWorkspaceEndpointParams) {
  return await invokeEndpointWithAuth<IGetWorkspaceEndpointResult>({
    path: getWorkspaceURL,
    data: props,
  });
}

export interface IGetRequestWorkspaceEndpointParams {
  workspaceId: string;
}

export type IGetRequestWorkspaceEndpointResult = GetEndpointResult<{
  workspace: IRequestWorkspace;
}>;

async function getRequestWorkspace(props: IGetRequestWorkspaceEndpointParams) {
  return await invokeEndpointWithAuth<IGetRequestWorkspaceEndpointResult>({
    path: getRequestWorkspaceURL,
    data: props,
  });
}

export type IGetUserWorkspacesEndpointResult = GetEndpointResult<{
  workspaces: IWorkspace[];
}>;

async function getUserWorkspaces(props?: IPaginationQuery) {
  return await invokeEndpointWithAuth<IGetUserWorkspacesEndpointResult>({
    path: getUserWorkspacesURL,
    data: props,
  });
}

export interface IUpdateWorkspaceEndpointParams {
  workspaceId: string;
  workspace: IUpdateWorkspaceInput;
}

export type IUpdateWorkspaceEndpointResult = GetEndpointResult<{
  workspace: IWorkspace;
}>;

async function updateWorkspace(props: IUpdateWorkspaceEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateWorkspaceEndpointResult>({
    path: updateWorkspaceURL,
    data: props,
  });
}

export default class WorkspaceAPI {
  static addWorkspace = addWorkspace;
  static deleteWorkspace = deleteWorkspace;
  static getWorkspace = getWorkspace;
  static getRequestWorkspace = getRequestWorkspace;
  static getUserWorkspaces = getUserWorkspaces;
  static updateWorkspace = updateWorkspace;
}

export class WorkspaceURLs {
  static addWorkspace = addWorkspaceURL;
  static deleteWorkspace = deleteWorkspaceURL;
  static getWorkspace = getWorkspaceURL;
  static getRequestWorkspace = getRequestWorkspaceURL;
  static getUserWorkspaces = getUserWorkspacesURL;
  static updateWorkspace = updateWorkspaceURL;
}
