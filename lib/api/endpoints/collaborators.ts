import { IPresetInput } from "../../definitions/presets";
import { ICollaborator } from "../../definitions/user";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/collaborators";
const removeCollaboratorURL = `${baseURL}/removeCollaborator`;
const getWorkspaceCollaboratorsURL = `${baseURL}/getWorkspaceCollaborators`;
const getCollaboratorURL = `${baseURL}/getCollaborator`;
const updateCollaboratorPresetsURL = `${baseURL}/updateCollaboratorPresets`;

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

export interface IUpdateCollaboratorPresetsEndpointParams {
  workspaceId: string;
  collaboratorId: string;
  presets: IPresetInput[];
}

export type IUpdateCollaboratorPresetsEndpointResult = GetEndpointResult<{
  collaborator: ICollaborator;
}>;

async function updateCollaboratorPresets(
  props: IUpdateCollaboratorPresetsEndpointParams
) {
  return await invokeEndpointWithAuth<IUpdateCollaboratorPresetsEndpointResult>(
    {
      path: updateCollaboratorPresetsURL,
      data: props,
    }
  );
}

export default class CollaboratorAPI {
  public static removeCollaborator = removeCollaborator;
  public static getWorkspaceCollaborators = getWorkspaceCollaborators;
  public static getCollaborator = getCollaborator;
  public static updateCollaboratorPresets = updateCollaboratorPresets;
}

export class CollaboratorURLs {
  public static removeCollaborator = removeCollaboratorURL;
  public static getWorkspaceCollaborators = getWorkspaceCollaboratorsURL;
  public static getCollaborator = getCollaboratorURL;
  public static updateCollaboratorPresets = updateCollaboratorPresetsURL;
}
