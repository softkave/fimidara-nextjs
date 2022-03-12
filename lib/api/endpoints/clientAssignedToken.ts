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
const updateTokenURL = `${baseURL}/updateToken`;

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

export interface IUpdateClientAssignedTokenEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
  token: Partial<INewClientAssignedTokenInput>;
}

export type IUpdateClientAssignedTokenEndpointResult = GetEndpointResult<{
  token: IClientAssignedToken;
}>;

async function updateToken(props: IUpdateClientAssignedTokenEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateClientAssignedTokenEndpointResult>(
    {
      path: updateTokenURL,
      data: props,
    }
  );
}

export default class ClientAssignedTokenAPI {
  public static addToken = addToken;
  public static getOrganizationTokens = getOrganizationTokens;
  public static getToken = getToken;
  public static deleteToken = deleteToken;
  public static updateToken = updateToken;
}

export class ClientAssignedTokenURLs {
  public static addToken = addTokenURL;
  public static getOrganizationTokens = getOrganizationTokensURL;
  public static getToken = getTokenURL;
  public static deleteToken = deleteTokenURL;
  public static updateToken = updateTokenURL;
}
