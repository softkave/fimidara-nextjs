import {
  CollaborationRequestResponse,
  ICollaborationRequest,
  ICollaborationRequestInput,
  IUpdateCollaborationRequestInput,
} from "../../definitions/collaborationRequest";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/requests";
const deleteRequestURL = `${baseURL}/deleteRequest`;
const getWorkspaceRequestsURL = `${baseURL}/getWorkspaceRequests`;
const getUserRequestsURL = `${baseURL}/getUserRequests`;
const sendRequestURL = `${baseURL}/sendRequest`;
const updateRequestURL = `${baseURL}/updateRequest`;
const respondToRequestURL = `${baseURL}/respondToRequest`;
const revokeRequestURL = `${baseURL}/revokeRequest`;
const getRequestURL = `${baseURL}/getRequest`;

export interface IDeleteCollaborationRequestEndpointParams {
  requestId: string;
}

async function deleteRequest(props: IDeleteCollaborationRequestEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteRequestURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetWorkspaceCollaborationRequestsEndpointParams {
  workspaceId: string;
}

export type IGetWorkspaceCollaborationRequestsEndpointResult =
  GetEndpointResult<{
    requests: ICollaborationRequest[];
  }>;

async function getWorkspaceRequests(
  props: IGetWorkspaceCollaborationRequestsEndpointParams
) {
  return invokeEndpointWithAuth<IGetWorkspaceCollaborationRequestsEndpointResult>(
    {
      path: getWorkspaceRequestsURL,
      data: props,
    }
  );
}

export type IGetUserCollaborationRequestsEndpointResult = GetEndpointResult<{
  requests: ICollaborationRequest[];
}>;

async function getUserRequests() {
  return await invokeEndpointWithAuth<IGetUserCollaborationRequestsEndpointResult>(
    {
      path: getUserRequestsURL,
    }
  );
}

export interface IRespondToCollaborationRequestEndpointParams {
  requestId: string;
  response: CollaborationRequestResponse;
}

export type IRespondToCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function respondToRequest(
  props: IRespondToCollaborationRequestEndpointParams
) {
  return await invokeEndpointWithAuth<IRespondToCollaborationRequestEndpointResult>(
    {
      path: respondToRequestURL,
      data: props,
    }
  );
}

export interface IRevokeCollaborationRequestEndpointParams {
  requestId: string;
}

export type IRevokeCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function revokeRequest(props: IRevokeCollaborationRequestEndpointParams) {
  return await invokeEndpointWithAuth<IRevokeCollaborationRequestEndpointResult>(
    {
      path: revokeRequestURL,
      data: props,
    }
  );
}

export interface ISendCollaborationRequestEndpointParams {
  workspaceId: string;
  request: ICollaborationRequestInput;
}

export type ISendCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function sendRequest(props: ISendCollaborationRequestEndpointParams) {
  return await invokeEndpointWithAuth<ISendCollaborationRequestEndpointResult>({
    path: sendRequestURL,
    data: props,
  });
}

export interface IUpdateCollaborationRequestEndpointParams {
  requestId: string;
  request: IUpdateCollaborationRequestInput;
}

export type IUpdateCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function updateRequest(props: IUpdateCollaborationRequestEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateCollaborationRequestEndpointResult>(
    {
      path: updateRequestURL,
      data: props,
    }
  );
}

export interface IGetCollaborationRequestEndpointParams {
  requestId: string;
}

export type IGetCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function getRequest(props: IGetCollaborationRequestEndpointParams) {
  return await invokeEndpointWithAuth<IGetCollaborationRequestEndpointResult>({
    path: getRequestURL,
    data: props,
  });
}

export default class CollaborationRequestAPI {
  public static deleteRequest = deleteRequest;
  public static getWorkspaceRequests = getWorkspaceRequests;
  public static getUserRequests = getUserRequests;
  public static sendRequest = sendRequest;
  public static updateRequest = updateRequest;
  public static respondToRequest = respondToRequest;
  public static revokeRequest = revokeRequest;
  public static getRequest = getRequest;
}

export class CollaborationRequestURLs {
  public static deleteRequest = deleteRequestURL;
  public static getWorkspaceRequests = getWorkspaceRequestsURL;
  public static getUserRequests = getUserRequestsURL;
  public static sendRequest = sendRequestURL;
  public static updateRequest = updateRequestURL;
  public static respondToRequest = respondToRequestURL;
  public static revokeRequest = revokeRequestURL;
  public static getRequest = getRequestURL;
}
