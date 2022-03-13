import { IAssignedPresetPermissionsGroup, IPresetInput } from "./presets";
import { IAgent } from "./system";

export interface IProgramAccessToken {
  resourceId: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: IAgent;
  organizationId: string;
  presets: IAssignedPresetPermissionsGroup[];
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  tokenStr: string;
}

export interface INewProgramAccessTokenInput {
  name: string;
  description?: string;
  presets?: IPresetInput[];
}

export type IUpdateProgramAccessTokenInput =
  Partial<INewProgramAccessTokenInput>;
