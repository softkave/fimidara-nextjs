import { IAgent } from "./system";

export interface IAssignedPresetPermissionsGroup {
  presetId: string;
  assignedAt: string;
  assignedBy: IAgent;
  order: number;
}

export interface IPresetPermissionsGroup {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  name: string;
  description?: string;
  presets: IAssignedPresetPermissionsGroup[];
}

export interface IPresetInput {
  presetId: string;
  order: number;
}

export interface INewPresetPermissionsGroupInput {
  name: string;
  description?: string;
  presets?: IPresetInput[];
}

export type IUpdatePresetPermissionsGroupInput =
  Partial<INewPresetPermissionsGroupInput>;

export const presetPermissionsGroupConstants = {
  maxAssignedPresets: 100,
};
