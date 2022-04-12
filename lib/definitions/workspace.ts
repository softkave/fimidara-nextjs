import { IAgent } from "./system";

export interface IWorkspace {
  resourceId: string;
  createdBy: IAgent;
  createdAt: string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  name: string;
  description?: string;
}

export interface INewWorkspaceInput {
  name: string;
  description?: string;
}

export interface IRequestWorkspace {
  workspaceId: string;
  name: string;
}

export type IUpdateWorkspaceInput = Partial<INewWorkspaceInput>;
