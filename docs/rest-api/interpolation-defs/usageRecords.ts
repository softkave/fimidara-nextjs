import {AppResourceType, BasicCRUDActions, IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/**
 * @category Usage records
 *
 * @description
 * Represents the different kinds of usage tracked and counts towards billing
 * on fimidara
 **/
export enum UsageRecordCategory {
  /** Usage category for files stored on fimidara */
  Storage = 'storage',

  /** Usage category for files uploaded to fimidara */
  BandwidthIn = 'bandwidth-in',

  /** Usage category for files downloaded from fimidara */
  BandwidthOut = 'bandwidth-out',

  /** Usage category representing total usage of tracked metrics */
  Total = 'total',
}

/**
 * @category Usage records
 * @description
 * Represents the type of artifact responsible for a particular usage record
 **/
export enum UsageRecordArtifactType {
  /** Artifact type for files */
  File = 'file',
}

/**
 * @category Usage records
 * @description
 * Represents an artifact responsible for a particular usage record
 * */
export interface IUsageRecordArtifact {
  /** Usage record specific type of the artifact */
  type: UsageRecordArtifactType;

  /** fimidara resource type of the artifact */
  resourceType?: AppResourceType;

  /** Action performed on or by artifact */
  action?: BasicCRUDActions;

  /**
   * Artifact responsible for the usage record.
   * - {@link IFileUsageRecordArtifact} when type is
   *   {@link UsageRecordArtifactType.File} and
   *   {@link UsageRecordCategory.Storage}
   * - {@link IBandwidthUsageRecordArtifact} when type is
   *   {@link UsageRecordArtifactType.File} and
   *   {@link UsageRecordCategory.BandwidthIn} or
   *   {@link UsageRecordCategory.BandwidthOut}
   */
  artifact: any;
}

/**
 * @category Usage records
 * @description
 * Represents the status of a usage record's fulfillment. Whether it was served
 * or not.
 */
export enum UsageRecordFulfillmentStatus {
  /** Usage record has been fulfilled */
  Fulfilled = 'fulfilled',
  /** Usage record has not been fulfilled */
  Dropped = 'dropped',
}

/**
 * @category Usage records
 * @description
 * Represents the reason a usage request was dropped. */
export enum UsageRecordDropReason {
  /** Usage record was dropped because threshold for the category requested or
   * total threshold has been reached */
  UsageExceeded = 'usage-exceeded',
  /** Usage record was dropped because the bill is overdue */
  BillOverdue = 'bill-overdue',
}

/**
 * @category Usage records
 * @description
 * Represents the summation level of a usage record. When requests come in,
 * individual requests map to a single usage record which will later be summed
 * up into a level 2 or higher usage record. Higher levels give overall usage
 * over a period of time. */
export enum UsageSummationType {
  /** Usage record is a summation of individual requests */
  One = 1,
  /** Usage record is a summation of other usage records */
  Two = 2,
}

/**
 * @category Usage records
 * @description
 * Represents a usage record for a particular request.
 * */
export interface IUsageRecord {
  resourceId: string;
  workspaceId: string;
  category: UsageRecordCategory;
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;

  /**
   * Reporting month.
   */
  month: number;

  /**
   * Reporting year.
   */
  year: number;

  /**
   * - Usage is bytes for {@link UsageRecordCategory.Storage},
   *   {@link UsageRecordCategory.BandwidthIn}, and {@link
   *   UsageRecordCategory.BandwidthOut */
  usage: number;

  /**
   * Cost of usage in USD. Usage cost is calculated as usage * cost per usage.
   * Usage cost will be individual cost for {@link UsageSummationType.One} and
   * aggregated cost for {@link UsageSummationType.Two}
   */
  usageCost: number;

  /**
   * Status of usage record fulfillment. Whether it was served or not. For each
   * reporting month, there will be two {@link UsageSummationType.Two}, one for
   * {@link UsageRecordFulfillmentStatus.Fulfilled} and one for
   * {@link UsageRecordFulfillmentStatus.Dropped}
   */
  fulfillmentStatus: UsageRecordFulfillmentStatus;

  /**
   * The summaton level of the usage record
   */
  summationType: UsageSummationType;

  /**
   * Artifacts responsible for the usage record.
   * Applies only to {@link UsageSummationType.One}
   */
  artifacts: IUsageRecordArtifact[];

  /**
   * Reason for the usage record to be dropped.
   * Applies only to {@link UsageSummationType.One}
   */
  dropReason?: UsageRecordDropReason;

  /**
   * Reason for the usage record to be dropped.
   * Applies only to {@link UsageSummationType.One}
   */
  dropMessage?: string;
}

/**
 * @category Usage records
 * @description
 * Artifact structure for {@link UsageRecordCategory.Storage} and
 * {@link UsageRecordArtifactType.File}
 */
export interface IFileUsageRecordArtifact {
  fileId: string;
  filepath: string;

  /**
   * The previous size of the file in bytes if the file is being overwritten.
   */
  oldFileSize?: number;

  /**
   * The ID of the request responsible for the usage record.
   * Not useful for now cause requests are not surfaced from the API.
   */
  requestId: string;
}

/**
 * @category Usage records
 * @description
 * Artifact structure for {@link UsageRecordCategory.BandwidthIn} and
 * {@link UsageRecordArtifactType.BandwidthOut} and
 * {@link UsageRecordArtifactType.File}
 */
export interface IBandwidthUsageRecordArtifact {
  fileId: string;
  filepath: string;

  /**
   * The ID of the request responsible for the usage record.
   * Not useful for now cause requests are not surfaced from the API.
   */
  requestId: string;
}

/**
 * @category Usage records
 **/
export interface IGetUsageCostsEndpointResult extends IEndpointResultBase {
  costs: Record<UsageRecordCategory, number>;
}

/** @category Usage records */
export interface IGetWorkspaceSummedUsageEndpointParams
  extends IEndpointParamsBase {
  workspaceId?: string;
  categories?: UsageRecordCategory[];
  fromDate?: string;
  toDate?: string;
  fulfillmentStatus?: UsageRecordFulfillmentStatus;
}

/** @category Usage records */
export interface IGetWorkspaceSummedUsageEndpointResult
  extends IEndpointResultBase {
  records: IUsageRecord[];
}

/** @category Usage records */
export interface IUsageRecordEndpoints {
  /**
   * Get the cost of usage for all categories.
   */
  getUsageCosts(): Promise<IGetUsageCostsEndpointResult>;

  /**
   * Get the {@link UsageSummationType.Two} usage records for a workspace.
   */
  getWorkspaceSummedUsage(
    props: IGetWorkspaceSummedUsageEndpointParams
  ): Promise<IGetWorkspaceSummedUsageEndpointResult>;
}
