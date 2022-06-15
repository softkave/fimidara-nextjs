import { IPermissionGroupInput } from "../../definitions/permissionGroups";
import { ICollaborator } from "../../definitions/user";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/collaborators";
const removeCollaboratorURL = `${baseURL}/removeCollaborator`;
const getWorkspaceCollaboratorsURL = `${baseURL}/getWorkspaceCollaborators`;
const getCollaboratorURL = `${baseURL}/getCollaborator`;
const updateCollaboratorPermissionGroupsURL = `${baseURL}/updateCollaboratorPermissionGroups`;

export interface IGetCollaboratorEndpointParams {
  workspaceId: string;
  collaboratorId: string;
}

export type IGetCollaboratorEndpointResult = GetEndpointResult<{
  collaborator: ICollaborator;
}>;

async function getCollaborator(props: IGetCollaboratorEndpointParams) {
  return invokeEndpointWithAuth<IGetCollaboratorEndpointResult>({
    path: getCollaboratorURL,
    data: props,
  });
}

export interface IGetWorkspaceCollaboratorsEndpointParams {
  workspaceId: string;
}

export type IGetWorkspaceCollaboratorsEndpointResult = GetEndpointResult<{
  collaborators: ICollaborator[];
}>;

async function getWorkspaceCollaborators(
  props: IGetWorkspaceCollaboratorsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetWorkspaceCollaboratorsEndpointResult>(
    {
      path: getWorkspaceCollaboratorsURL,
      data: props,
    }
  );
}

export interface IRemoveCollaboratorEndpointParams {
  workspaceId: string;
  collaboratorId: string;
}

async function removeCollaborator(props: IRemoveCollaboratorEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: removeCollaboratorURL,
    data: props,
  });
}

export interface IUpdateCollaboratorPermissionGroupsEndpointParams {
  workspaceId: string;
  collaboratorId: string;
  permissionGroups: IPermissionGroupInput[];
}

export type IUpdateCollaboratorPermissionGroupsEndpointResult =
  GetEndpointResult<{
    collaborator: ICollaborator;
  }>;

async function updateCollaboratorPermissionGroups(
  props: IUpdateCollaboratorPermissionGroupsEndpointParams
) {
  return await invokeEndpointWithAuth<IUpdateCollaboratorPermissionGroupsEndpointResult>(
    {
      path: updateCollaboratorPermissionGroupsURL,
      data: props,
    }
  );
}

export default class CollaboratorAPI {
  public static removeCollaborator = removeCollaborator;
  public static getWorkspaceCollaborators = getWorkspaceCollaborators;
  public static getCollaborator = getCollaborator;
  public static updateCollaboratorPermissionGroups =
    updateCollaboratorPermissionGroups;
}

export class CollaboratorURLs {
  public static removeCollaborator = removeCollaboratorURL;
  public static getWorkspaceCollaborators = getWorkspaceCollaboratorsURL;
  public static getCollaborator = getCollaboratorURL;
  public static updateCollaboratorPermissionGroups =
    updateCollaboratorPermissionGroupsURL;
}
