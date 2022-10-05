import { IAgent } from "./system";
import { UsageRecordCategory } from "./usageRecord";

export interface IUsageThreshold {
  lastUpdatedBy: IAgent;
  lastUpdatedAt: Date | string;
  category: UsageRecordCategory;
  budget: number; // price in USD
}

export interface IUsageThresholdLock {
  lastUpdatedBy: IAgent;
  lastUpdatedAt: Date | string;
  category: UsageRecordCategory;
  locked: boolean;
}

export interface IWorkspace {
  resourceId: string;
  createdBy: IAgent;
  createdAt: string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  name: string;
  rootname: string;
  description?: string;
  usageThresholds?: Partial<Record<UsageRecordCategory, IUsageThreshold>>;
  usageThresholdLocks?: Partial<
    Record<UsageRecordCategory, IUsageThresholdLock>
  >;
}

export interface INewWorkspaceInput {
  name: string;
  rootname: string;
  description?: string;
}

export interface IRequestWorkspace {
  workspaceId: string;
  name: string;
}

export type IUpdateWorkspaceInput = Partial<
  Omit<INewWorkspaceInput, "rootname">
>;
