import { IAgent } from "./system";

export interface IOrganization {
  resourceId: string;
  createdBy: IAgent;
  createdAt: string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  name: string;
  description?: string;
}

export interface INewOrganizationInput {
  name: string;
  description?: string;
}

export interface IRequestOrganization {
  organizationId: string;
  name: string;
}

export type IUpdateOrganizationInput = Partial<INewOrganizationInput>;
