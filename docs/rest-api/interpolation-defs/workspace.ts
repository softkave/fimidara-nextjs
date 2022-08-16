import {IAgent} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';
import {UsageRecordCategory} from './usageRecords';

/** @category Workspace */
export enum WorkspaceBillStatus {
  /** Workspace is OK and operations will continue as normal. */
  Ok = 'ok',

  /** Workspace is in the grace period. Grace period is the time given to the
   * workspace to pay it's bill for the previous billing period. During this
   * time, operations will still continue as normal. */
  GracePeriod = 'grace-period',

  /** The bill for the previous billing period is overdue, and operations will
   * not be served. Meaning API calls will fail with a `UsageLimitExceededError`
   * error until the workspace's bill is resolved. */
  BillOverdue = 'bill-overdue',
}

/** @category Workspace */
export interface IUsageThreshold {
  lastUpdatedBy: IAgent;
  lastUpdatedAt: Date | string;

  /** The category of usage that the threshold is for. */
  category: UsageRecordCategory;

  /** The budget in USD that the workspace is allowed to spend for this
   * category. */
  budget: number;
}

/** @category Workspace */
export interface IUsageThresholdLock {
  lastUpdatedBy: IAgent;
  lastUpdatedAt: Date | string;

  /** The category of usage that the lock is for. */
  category: UsageRecordCategory;

  /** Whether the workspace is locked for this category. */
  locked: boolean;
}

/** @category Workspace */
export interface IWorkspace {
  resourceId: string;
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy: IAgent;
  lastUpdatedAt: Date | string;

  /**
   * Unique workspace name, not case sensitive. Meaning, 'My Workspace Name'
   * will match 'my workspace name'.
   * */
  name: string;

  /**
   * Unique workspace root name, not case sensitive. Meaning,
   * 'My-Workspace-Name' will match 'my-workspace-name'. Used for namespacing
   * when working with files and folders. For example
   * "/my-workspace-name/my-file.txt"
   * */
  rootname: string;
  description?: string;

  /**
   * The public permission group ID. The public permission group is the
   * permission group assigned to unauthenticated or unauthorized agents. For
   * example, if a `GET` `HTTP` request is made for a file without the
   * `Authentication` header, or authentication or authorization fails for any
   * reason, the calling agent will be assigned the public permission group
   * while the server processes the request. The permission group is also
   * assigned to all agents when processing a request but given the least
   * weight. Meaning if an agent does not explicitly have a access to a file,
   * but the public permission group has access to it, i.e, the file is
   * designated public, the agent will be able to access the file.
   *
   * This permission group is auto-generated when the workspace is created, and
   * this field is its ID.
   *
   * You can add permission items to this permission to make resources publicly
   * accessible.
   */
  publicPermissionGroupId?: string;
  billStatusAssignedAt: Date | string;

  /** The workspace's bill status. */
  billStatus: WorkspaceBillStatus;
  usageThresholds?: Partial<Record<UsageRecordCategory, IUsageThreshold>>;
  usageThresholdLocks?: Partial<
    Record<UsageRecordCategory, IUsageThresholdLock>
  >;
}

/** @category Workspace */
export interface INewWorkspaceInput {
  /** Unique resource name, not case sensitive. Meaning, 'MyResourceName' will
   * match 'myresourcename'. */
  name: string;

  /**
   * Unique workspace root name, not case sensitive. Meaning,
   * 'My-Workspace-Name' will match 'my-workspace-name'. Used for namespaceing
   * files when fetching or creating files. For example
   * "/my-workspace-name/my-file.txt"
   *
   * Valid characters are: /[A-Za-z0-9._-]/
   * */
  rootname: string;
  description?: string;
}

/** @category Workspace */
export type IUpdateWorkspaceInput = Partial<
  Omit<INewWorkspaceInput, 'rootname'>
>;

/** @category Workspace */
export interface IGetWorkspaceEndpointParams extends IEndpointParamsBase {
  workspaceId: string;
}

/** @category Workspace */
export interface IGetWorkspaceEndpointResult extends IEndpointResultBase {
  workspace: IWorkspace;
}

/** @category Workspace */
export interface IUpdateWorkspaceEndpointParams extends IEndpointParamsBase {
  workspaceId: string;
  workspace: IUpdateWorkspaceInput;
}

/** @category Workspace */
export interface IUpdateWorkspaceEndpointResult extends IEndpointResultBase {
  workspace: IWorkspace;
}

/** @category Workspace */
export interface IWorkspaceEndpoints {
  getWorkspace(
    props: IGetWorkspaceEndpointParams
  ): Promise<IGetWorkspaceEndpointResult>;
  updateWorkspace(
    props: IUpdateWorkspaceEndpointParams
  ): Promise<IUpdateWorkspaceEndpointResult>;
}

/**
 * @category File
 * @description
 * Utility functions for transforming the supplied name to a valid workspace
 * rootname. It will transform the name to lowercase, replace all spaces with
 * hyphens, and remove all non-alphanumeric characters.
 **/
export function makeRootnameFromName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, ' ')
    .replace(/[\s-]+/g, '-')
    .toLowerCase();
}
