export interface ICollaborationRequestInput {
  recipientEmail: string;
  message: string;
  expires?: number;
}

export interface IUpdateCollaborationRequestInput {
  message?: string;
  expiresAt?: number;
}
