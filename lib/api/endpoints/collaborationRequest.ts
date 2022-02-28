import {
  CollaborationRequestResponse,
  ICollaborationRequest,
  ICollaborationRequestInput,
  IUpdateCollaborationRequestInput,
} from "../../definitions/collaborationRequest";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "collaborationRequests";

export interface IDeleteCollaborationRequestEndpointParams {
  requestId: string;
}

async function deleteRequest(props: IDeleteCollaborationRequestEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteRequest`,
    data: props,
  });
}

export interface IGetOrganizationCollaborationRequestsEndpointParams {
  organizationId: string;
}

export type IGetOrganizationCollaborationRequestsEndpointResult =
  GetEndpointResult<{
    requests: ICollaborationRequest[];
  }>;

async function getOrganizationRequests(
  props: IGetOrganizationCollaborationRequestsEndpointParams
) {
  return invokeEndpointWithAuth<IGetOrganizationCollaborationRequestsEndpointResult>(
    {
      path: `${baseURL}/getOrganizationRequests`,
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
      path: `${baseURL}/getUserRequests`,
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
      path: `${baseURL}/respondToRequest`,
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
      path: `${baseURL}/revokeRequest`,
      data: props,
    }
  );
}

export interface ISendCollaborationRequestEndpointParams {
  organizationId: string;
  request: ICollaborationRequestInput;
}

export type ISendCollaborationRequestEndpointResult = GetEndpointResult<{
  request: ICollaborationRequest;
}>;

async function sendRequest(props: ISendCollaborationRequestEndpointParams) {
  return await invokeEndpointWithAuth<ISendCollaborationRequestEndpointResult>({
    path: `${baseURL}/sendRequest`,
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
      path: `${baseURL}/updateRequest`,
      data: props,
    }
  );
}

export default class CollaborationRequestAPI {
  public static deleteRequest = deleteRequest;
  public static getOrganizationRequests = getOrganizationRequests;
  public static getUserRequests = getUserRequests;
  public static sendRequest = sendRequest;
  public static updateRequest = updateRequest;
  public static respondToRequest = respondToRequest;
  public static revokeRequest = revokeRequest;
}
