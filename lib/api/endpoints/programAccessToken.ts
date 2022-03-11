import {
  INewProgramAccessTokenInput,
  IProgramAccessToken,
  IUpdateProgramAccessTokenInput,
} from "../../definitions/programAccessToken";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/programAccessTokens";
const addTokenURL = `${baseURL}/addToken`;
const getOrganizationTokensURL = `${baseURL}/getOrganizationTokens`;
const getTokenURL = `${baseURL}/getToken`;
const deleteTokenURL = `${baseURL}/deleteToken`;
const updateTokenURL = `${baseURL}/updateToken`;

export interface IAddProgramAccessTokenEndpointParams {
  organizationId: string;
  token: INewProgramAccessTokenInput;
}

export type IAddProgramAccessTokenEndpointResult = GetEndpointResult<{
  token: IProgramAccessToken;
}>;

async function addToken(props: IAddProgramAccessTokenEndpointParams) {
  return invokeEndpointWithAuth<IAddProgramAccessTokenEndpointResult>({
    path: addTokenURL,
    data: props,
  });
}

export interface IDeleteProgramAccessTokenEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
}

async function deleteToken(props: IDeleteProgramAccessTokenEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteTokenURL,
    data: props,
  });
}

export interface IGetOrganizationProgramAccessTokenEndpointParams {
  organizationId: string;
}

export type IGetOrganizationProgramAccessTokenEndpointResult =
  GetEndpointResult<{
    tokens: IProgramAccessToken[];
  }>;

async function getOrganizationTokens(
  props: IGetOrganizationProgramAccessTokenEndpointParams
) {
  return await invokeEndpointWithAuth<IGetOrganizationProgramAccessTokenEndpointResult>(
    {
      path: getOrganizationTokensURL,
      data: props,
    }
  );
}

export interface IGetProgramAccessTokenEndpointParams {
  tokenId: string;
}

export type IGetProgramAccessTokenEndpointResult = GetEndpointResult<{
  token: IProgramAccessToken;
}>;

async function getToken(props: IGetProgramAccessTokenEndpointParams) {
  return await invokeEndpointWithAuth<IGetProgramAccessTokenEndpointResult>({
    path: getTokenURL,
    data: props,
  });
}

export interface IUpdateProgramAccessTokenEndpointParams {
  tokenId?: string;
  onReferenced?: boolean;
  token: IUpdateProgramAccessTokenInput;
}

export type IUpdateProgramAccessTokenEndpointResult = GetEndpointResult<{
  token: IProgramAccessToken;
}>;

async function updateToken(props: IUpdateProgramAccessTokenEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateProgramAccessTokenEndpointResult>({
    path: updateTokenURL,
    data: props,
  });
}

export default class ProgramAccessTokenAPI {
  public static addToken = addToken;
  public static getOrganizationTokens = getOrganizationTokens;
  public static getToken = getToken;
  public static deleteToken = deleteToken;
  public static updateToken = updateToken;
}

export class ProgramAccessTokenURLs {
  public static addToken = addTokenURL;
  public static getOrganizationTokens = getOrganizationTokensURL;
  public static getToken = getTokenURL;
  public static deleteToken = deleteTokenURL;
  public static updateToken = updateTokenURL;
}
