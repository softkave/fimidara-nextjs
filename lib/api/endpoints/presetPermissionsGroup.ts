import {
  INewPresetPermissionsGroupInput,
  IPresetPermissionsGroup,
  IUpdatePresetPermissionsGroupInput,
} from "../../definitions/presets";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/presetPermissionsGroups";
const addPresetURL = `${baseURL}/addPreset`;
const getWorkspacePresetsURL = `${baseURL}/getWorkspacePresets`;
const getPresetURL = `${baseURL}/getPreset`;
const deletePresetURL = `${baseURL}/deletePreset`;
const updatePresetURL = `${baseURL}/updatePreset`;

export interface IAddPresetPermissionsGroupEndpointParams {
  workspaceId: string;
  preset: INewPresetPermissionsGroupInput;
}

export type IAddPresetPermissionsGroupEndpointResult = GetEndpointResult<{
  preset: IPresetPermissionsGroup;
}>;

async function addPreset(props: IAddPresetPermissionsGroupEndpointParams) {
  return invokeEndpointWithAuth<IAddPresetPermissionsGroupEndpointResult>({
    path: addPresetURL,
    data: props,
  });
}

export interface IDeletePresetPermissionsGroupEndpointParams {
  presetId: string;
}

async function deletePreset(
  props: IDeletePresetPermissionsGroupEndpointParams
) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deletePresetURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetWorkspacePresetPermissionsGroupEndpointParams {
  workspaceId: string;
}

export type IGetWorkspacePresetPermissionsGroupEndpointResult =
  GetEndpointResult<{
    presets: IPresetPermissionsGroup[];
  }>;

async function getWorkspacePresets(
  props: IGetWorkspacePresetPermissionsGroupEndpointParams
) {
  return await invokeEndpointWithAuth<IGetWorkspacePresetPermissionsGroupEndpointResult>(
    {
      path: getWorkspacePresetsURL,
      data: props,
    }
  );
}

export interface IGetPresetPermissionsGroupEndpointParams {
  presetId: string;
}

export type IGetPresetPermissionsGroupEndpointResult = GetEndpointResult<{
  preset: IPresetPermissionsGroup;
}>;

async function getPreset(props: IGetPresetPermissionsGroupEndpointParams) {
  return await invokeEndpointWithAuth<IGetPresetPermissionsGroupEndpointResult>(
    {
      path: getPresetURL,
      data: props,
    }
  );
}

export interface IUpdatePresetPermissionsGroupEndpointParams {
  presetId: string;
  preset: IUpdatePresetPermissionsGroupInput;
}

export type IUpdatePresetPermissionsGroupEndpointResult = GetEndpointResult<{
  preset: IPresetPermissionsGroup;
}>;

async function updatePreset(
  props: IUpdatePresetPermissionsGroupEndpointParams
) {
  return await invokeEndpointWithAuth<IUpdatePresetPermissionsGroupEndpointResult>(
    {
      path: updatePresetURL,
      data: props,
    }
  );
}

export default class PresetPermissionsGroupAPI {
  public static addPreset = addPreset;
  public static getWorkspacePresets = getWorkspacePresets;
  public static getPreset = getPreset;
  public static deletePreset = deletePreset;
  public static updatePreset = updatePreset;
}

export class PresetPermissionsGroupURL {
  public static addPreset = addPresetURL;
  public static getWorkspacePresets = getWorkspacePresetsURL;
  public static getPreset = getPresetURL;
  public static deletePreset = deletePresetURL;
  public static updatePreset = updatePresetURL;
}
