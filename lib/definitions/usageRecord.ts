import { AppResourceType, BasicCRUDActions, IAgent } from "./system";

export enum UsageRecordCategory {
  Storage = "storage",
  BandwidthIn = "bandwidth-in",
  BandwidthOut = "bandwidth-out",
  Total = "total",
}

export enum UsageRecordArtifactType {
  File = "file",
}

export interface IUsageRecordArtifact {
  type: UsageRecordArtifactType;
  resourceType?: AppResourceType;
  action?: BasicCRUDActions;
  artifact: any;
}

export enum UsageRecordFulfillmentStatus {
  // usage record has been fulfilled
  Fulfilled = "fulfilled",
  // usage record has not been fulfilled
  Dropped = "dropped",
}

export enum UsageRecordDropReason {
  UsageExceeded = "usage-exceeded",
  BillOverdue = "bill-overdue",
}

export enum UsageSummationType {
  One = 1,
  Two = 2,
}

export interface IUsageRecord {
  resourceId: string;
  workspaceId: string;
  category: UsageRecordCategory;
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;

  // usage is count for requests and db objects
  // usage is bytes for storage, bandwidth in, and bandwidth out
  usage: number;
  usageCost: number;
  fulfillmentStatus: UsageRecordFulfillmentStatus;
  summationType: UsageSummationType;

  // summation level 1
  artifacts: IUsageRecordArtifact[];
  dropReason?: UsageRecordDropReason;
  dropMessage?: string;

  // summation level 2
  month: number;
  year: number;
}

export interface IFileUsageRecordArtifact {
  fileId: string;
  filepath: string;
  oldFileSize?: number;
  requestId: string;
}

export interface IBandwidthUsageRecordArtifact {
  fileId: string;
  filepath: string;
  requestId: string;
}

export type UsageCosts = Record<UsageRecordCategory, number>;

export const getCostForUsage = (costPerUnit: number, usage: number) => {
  return costPerUnit ? costPerUnit * usage : 0;
};

export function getUsageForCost(costPerUnit: number, cost: number) {
  return costPerUnit ? cost / costPerUnit : 0;
}
