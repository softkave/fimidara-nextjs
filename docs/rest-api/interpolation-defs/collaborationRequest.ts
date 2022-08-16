import {IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Collaboration request */
export enum CollaborationRequestStatusinterface {
  Accepted = 'accepted',
  Declined = 'declined',
  Revoked = 'revoked',
  Pending = 'pending',
}

/** @category Collaboration request */
export interface ICollaborationRequestStatus {
  status: CollaborationRequestStatusinterface;
  date: string;
}

export enum CollaborationRequestEmailReason {
  RequestNotification = 'request-notification',
  RequestRevoked = 'request-revoked',
  RequestUpdated = 'request-updated',
}

/** @category Collaboration request */
export interface ICollaborationRequestSentEmailHistoryItem {
  date: string;
  reason: CollaborationRequestEmailReason;
}

/** @category Collaboration request */
export interface ICollaborationRequest {
  resourceId: string;
  recipientEmail: string;
  message: string;
  createdBy: IAgent;
  createdAt: string;
  expiresAt?: string;
  workspaceId: string;
  workspaceName: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  readAt?: string;
  statusHistory: ICollaborationRequestStatus[];
  sentEmailHistory: ICollaborationRequestSentEmailHistoryItem[];
}

/** @category Collaboration request */
export interface ICollaborationRequestInput {
  recipientEmail: string;
  message: string;
  expires?: string;
}

/** @category Collaboration request */
export interface IUpdateCollaborationRequestInput {
  message?: string;
  expires?: string;
}

/** @category Collaboration request */
export interface IDeleteCollaborationRequestEndpointParams
  extends IEndpointParamsBase {
  requestId: string;
}

/** @category Collaboration request */
export type IGetWorkspaceCollaborationRequestsEndpointParams =
  IEndpointParamsBase;

/** @category Collaboration request */
export interface IGetWorkspaceCollaborationRequestsEndpointResult
  extends IEndpointResultBase {
  requests: ICollaborationRequest[];
}

/** @category Collaboration request */
export interface IRevokeCollaborationRequestEndpointParams
  extends IEndpointParamsBase {
  requestId: string;
}

/** @category Collaboration request */
export interface IRevokeCollaborationRequestEndpointResult
  extends IEndpointResultBase {
  request: ICollaborationRequest;
}

/** @category Collaboration request */
export interface ISendCollaborationRequestEndpointParams
  extends IEndpointParamsBase {
  request: ICollaborationRequestInput;
}

/** @category Collaboration request */
export interface ISendCollaborationRequestEndpointResult
  extends IEndpointResultBase {
  request: ICollaborationRequest;
}

/** @category Collaboration request */
export interface IUpdateCollaborationRequestEndpointParams
  extends IEndpointParamsBase {
  requestId: string;
  request: IUpdateCollaborationRequestInput;
}

/** @category Collaboration request */
export interface IUpdateCollaborationRequestEndpointResult
  extends IEndpointResultBase {
  request: ICollaborationRequest;
}

/** @category Collaboration request */
export interface IGetCollaborationRequestEndpointParams
  extends IEndpointParamsBase {
  requestId: string;
}

/** @category Collaboration request */
export interface IGetCollaborationRequestEndpointResult
  extends IEndpointResultBase {
  request: ICollaborationRequest;
}

/** @category Collaboration request */
export interface ICollaborationRequestEndpoints {
  deleteRequest(
    props: IDeleteCollaborationRequestEndpointParams
  ): Promise<IEndpointResultBase>;
  getWorkspaceRequests(
    props: IGetWorkspaceCollaborationRequestsEndpointParams
  ): Promise<IGetWorkspaceCollaborationRequestsEndpointResult>;
  sendRequest(
    props: ISendCollaborationRequestEndpointParams
  ): Promise<ISendCollaborationRequestEndpointResult>;
  updateRequest(
    props: IUpdateCollaborationRequestEndpointParams
  ): Promise<IUpdateCollaborationRequestEndpointResult>;
  revokeRequest(
    props: IRevokeCollaborationRequestEndpointParams
  ): Promise<IRevokeCollaborationRequestEndpointResult>;
  getRequest(
    props: IGetCollaborationRequestEndpointParams
  ): Promise<IGetCollaborationRequestEndpointResult>;
}
