import { IPresetInput } from "../../definitions/presets";
import { ICollaborator } from "../../definitions/user";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/collaborators";
const removeCollaboratorURL = `${baseURL}/removeCollaborator`;
const getOrganizationCollaboratorsURL = `${baseURL}/getOrganizationCollaborators`;
const getCollaboratorURL = `${baseURL}/getCollaborator`;
const updateCollaboratorPresetsURL = `${baseURL}/updateCollaboratorPresets`;

export interface IGetCollaboratorEndpointParams {
  organizationId: string;
  collaboratorId: string;
}

export type IGetCollaboratorEndpointResult = GetEndpointResult<{
  token: ICollaborator;
}>;

async function getCollaborator(props: IGetCollaboratorEndpointParams) {
  return invokeEndpointWithAuth<IGetCollaboratorEndpointResult>({
    path: getCollaboratorURL,
    data: props,
  });
}

export interface IGetOrganizationCollaboratorsEndpointParams {
  organizationId: string;
}

export type IGetOrganizationCollaboratorsEndpointResult = GetEndpointResult<{
  collaborators: ICollaborator[];
}>;

async function getOrganizationCollaborators(
  props: IGetOrganizationCollaboratorsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetOrganizationCollaboratorsEndpointResult>(
    {
      path: getOrganizationCollaboratorsURL,
      data: props,
    }
  );
}

export interface IRemoveCollaboratorEndpointParams {
  organizationId: string;
  collaboratorId: string;
}

async function removeCollaborator(props: IRemoveCollaboratorEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: removeCollaboratorURL,
    data: props,
  });
}

export interface IUpdateCollaboratorPresetsEndpointParams {
  organizationId: string;
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
  public static getOrganizationCollaborators = getOrganizationCollaborators;
  public static getCollaborator = getCollaborator;
  public static updateCollaboratorPresets = updateCollaboratorPresets;
}

export class CollaboratorURLs {
  public static removeCollaborator = removeCollaboratorURL;
  public static getOrganizationCollaborators = getOrganizationCollaboratorsURL;
  public static getCollaborator = getCollaboratorURL;
  public static updateCollaboratorPresets = updateCollaboratorPresetsURL;
}
