import {
  IClientAssignedToken,
  INewClientAssignedTokenInput,
} from "../../definitions/clientAssignedToken";
import { IPresetInput } from "../../definitions/presets";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/clientAssignedTokens";
const addTokenURL = `${baseURL}/addToken`;
const getOrganizationTokensURL = `${baseURL}/getOrganizationTokens`;
const getTokenURL = `${baseURL}/getToken`;
const deleteTokenURL = `${baseURL}/deleteToken`;
const updatePresetsURL = `${baseURL}/updatePresets`;

export interface IAddClientAssignedTokenEndpointParams {
  organizationId?: string;
  token: INewClientAssignedTokenInput;
}

export type IAddClientAssignedTokenEndpointResult = GetEndpointResult<{
  token: IClientAssignedToken;
  tokenStr: string;
}>;

async function addToken(props: IAddClientAssignedTokenEndpointParams) {
  return invokeEndpointWithAuth<IAddClientAssignedTokenEndpointResult>({
    path: addTokenURL,
    data: props,
  });
}

export interface IDeleteClientAssignedTokenEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
}

async function deleteToken(props: IDeleteClientAssignedTokenEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteTokenURL,
    data: props,
  });
}

export interface IGetOrganizationClientAssignedTokensEndpointParams {
  organizationId: string;
}

export type IGetOrganizationClientAssignedTokensEndpointResult =
  GetEndpointResult<{
    tokens: IClientAssignedToken[];
  }>;

async function getOrganizationTokens(
  props: IGetOrganizationClientAssignedTokensEndpointParams
) {
  return await invokeEndpointWithAuth<IGetOrganizationClientAssignedTokensEndpointResult>(
    {
      path: getOrganizationTokensURL,
      data: props,
    }
  );
}

export interface IGetClientAssignedTokenEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
}

export type IGetClientAssignedTokenEndpointResult = GetEndpointResult<{
  token: IClientAssignedToken;
}>;

async function getToken(props: IGetClientAssignedTokenEndpointParams) {
  return await invokeEndpointWithAuth<IGetClientAssignedTokenEndpointResult>({
    path: getTokenURL,
    data: props,
  });
}

export interface IUpdateClientAssignedTokenPresetsEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
  presets: IPresetInput[];
}

export type IUpdateClientAssignedTokenPresetsEndpointResult =
  GetEndpointResult<{
    token: IClientAssignedToken;
  }>;

async function updatePresets(
  props: IUpdateClientAssignedTokenPresetsEndpointParams
) {
  return await invokeEndpointWithAuth<IUpdateClientAssignedTokenPresetsEndpointResult>(
    {
      path: updatePresetsURL,
      data: props,
    }
  );
}

export default class ClientAssignedTokenAPI {
  public static addToken = addToken;
  public static getOrganizationTokens = getOrganizationTokens;
  public static getToken = getToken;
  public static deleteToken = deleteToken;
  public static updatePresets = updatePresets;
}

export class ClientAssignedTokenURLs {
  public static addToken = addTokenURL;
  public static getOrganizationTokens = getOrganizationTokensURL;
  public static getToken = getTokenURL;
  public static deleteToken = deleteTokenURL;
  public static updatePresets = updatePresetsURL;
}
