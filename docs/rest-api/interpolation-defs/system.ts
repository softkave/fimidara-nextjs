export enum SessionAgentType {
  User = 'user',
  ProgramAccessToken = 'program-access-token',
  ClientAssignedToken = 'client-assigned-token',

  /**  For unauthenticated or unauthorized agents, like agents performing
   * operations on a public folder or file. */
  Public = 'public',

  /** For operations performed by the system, like when data definitions change
   * and data is moved from one format to the other. */
  System = 'fimidara-system',
}

/**
 * @category File
 * @description
 * Describes a public action allowed on a resource. A public action is an
 * action that can be performed by an unauthenticated or unauthorized agent. */
export interface IPublicAccessOpInput {
  /** Action permitted. */
  action: BasicCRUDActions;

  /** Resource type action is allowed on. */
  resourceType: AppResourceType.File | AppResourceType.Folder;
}

/**
 * @category File
 * @description
 * Describes an action a public agent is allowed to perform on a file or a
 * folder and it's children.
 **/
export interface IPublicAccessOp {
  /** Action permitted. */
  action: BasicCRUDActions;

  /** Resource type action is allowed on. */
  resourceType: AppResourceType.File | AppResourceType.Folder;
  markedAt: Date | string;
  markedBy: IAgent;
}

/** An agent is an entity that can perform an action. */
export interface IAgent {
  /** Agent ID. User ID when `agentType` is {@link SessionAgentType.User},
   * client assigned token ID when `agentType` is
   * {@link SessionAgentType.ClientAssignedToken}, program access token ID when
   * `agentType` is {@link SessionAgentType.ProgramAccessToken}, `public` when
   * `agentType` is {@link SessionAgentType.Public}, and `system` when
   * `agentType` is {@link SessionAgentType.System}.  */
  agentId: string;
  agentType: SessionAgentType;
}

export enum AppResourceType {
  Workspace = 'workspace',
  CollaborationRequest = 'collaboration-request',
  ProgramAccessToken = 'program-access-token',
  ClientAssignedToken = 'client-assigned-token',
  PermissionGroup = 'permission-group',
  PermissionItem = 'permission-item',
  Folder = 'folder',
  File = 'file',
  User = 'user',
}

export enum BasicCRUDActions {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',

  /** A workspace only permission action. It allows the bearer to grant and
   * remove permissions in a workspace. */
  GrantPermission = 'grant-permission',
}

export interface IAppError extends Error {
  /**
   * Path to offending value when the error type is a validation error. For
   * example, in the code below:
   *
   * ```typescript
   * const obj = {
   *  outerField: {
   *   innerField: 'value'
   *  }
   * };
   * ```
   *
   * The error path/field is `outerField.innerField` if the value contained does
   * not pass validation.
   */
  field?: string;

  /**
   * Server recommended action.
   * @todo Defined server recommended actions.
   */
  // action?: string;

  /** Offending value when the error type is a validation error. */
  // value?: any;

  /**
   * Client-side stack trace.
   * */
  stack?: string;
}
