import { IAgent } from "./system";

export enum CollaborationRequestStatusType {
  Accepted = "accepted",
  Declined = "declined",
  Revoked = "revoked",
  Pending = "pending",
}

export type CollaborationRequestResponse =
  | CollaborationRequestStatusType.Accepted
  | CollaborationRequestStatusType.Declined;

export interface ICollaborationRequestStatus {
  status: CollaborationRequestStatusType;
  date: string;
}

export enum CollaborationRequestEmailReason {
  RequestNotification = "request-notification",
  RequestRevoked = "request-revoked",
  RequestUpdated = "request-updated",
}

export interface ICollaborationRequestSentEmailHistoryItem {
  date: string;
  reason: CollaborationRequestEmailReason;
}

export interface ICollaborationRequest {
  resourceId: string;
  recipientEmail: string;
  message: string;
  createdBy: IAgent;
  createdAt: string;
  expiresAt?: string;
  organizationId: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  readAt?: string;
  statusHistory: ICollaborationRequestStatus[];
  sentEmailHistory: ICollaborationRequestSentEmailHistoryItem[];
}

export interface ICollaborationRequestInput {
  recipientEmail: string;
  message: string;
  expires?: number;
}

export interface IUpdateCollaborationRequestInput {
  message?: string;
  expiresAt?: number;
}
