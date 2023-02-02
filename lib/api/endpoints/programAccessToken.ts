import {
  INewProgramAccessTokenInput,
  IProgramAccessToken,
  IUpdateProgramAccessTokenInput,
} from "../../definitions/programAccessToken";
import {
  GetEndpointResult,
  IEndpointResultBase,
  IPaginationQuery,
} from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/v1/programAccessTokens";
const addTokenURL = `${baseURL}/addToken`;
const getWorkspaceTokensURL = `${baseURL}/getWorkspaceTokens`;
const getTokenURL = `${baseURL}/getToken`;
const deleteTokenURL = `${baseURL}/deleteToken`;
const updateTokenURL = `${baseURL}/updateToken`;

export interface IAddProgramAccessTokenEndpointParams {
  workspaceId: string;
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
    method: "DELETE",
  });
}

export interface IGetWorkspaceProgramAccessTokenEndpointParams
  extends IPaginationQuery {
  workspaceId: string;
}

export type IGetWorkspaceProgramAccessTokenEndpointResult = GetEndpointResult<{
  tokens: IProgramAccessToken[];
}>;

async function getWorkspaceTokens(
  props: IGetWorkspaceProgramAccessTokenEndpointParams
) {
  return await invokeEndpointWithAuth<IGetWorkspaceProgramAccessTokenEndpointResult>(
    {
      path: getWorkspaceTokensURL,
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
  static addToken = addToken;
  static getWorkspaceTokens = getWorkspaceTokens;
  static getToken = getToken;
  static deleteToken = deleteToken;
  static updateToken = updateToken;
}

export class ProgramAccessTokenURLs {
  static addToken = addTokenURL;
  static getWorkspaceTokens = getWorkspaceTokensURL;
  static getToken = getTokenURL;
  static deleteToken = deleteTokenURL;
  static updateToken = updateTokenURL;
}
