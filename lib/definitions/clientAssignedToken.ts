import { IAssignedPresetPermissionsGroup, IPresetInput } from "./presets";
import { IAgent } from "./system";

export interface IClientAssignedToken {
  resourceId: string;
  providedResourceId?: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  organizationId: string;
  version: number;
  presets: IAssignedPresetPermissionsGroup[];
  issuedAt: string;
  expires?: number;
  tokenStr: string;
}

export interface INewClientAssignedTokenInput {
  expires?: number;
  presets?: IPresetInput[];
  providedResourceId?: string;
}

export const clientAssignedTokenConstants = { providedResourceMaxLength: 300 };
