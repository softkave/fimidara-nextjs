import { FimidaraResourceType } from "fimidara";

const RESOURCE_TYPE_SHORT_NAME_MAX_LEN = 7;
const RESOURCE_TYPE_SHORT_NAME_PADDING = "0";

function padShortName(shortName: string) {
  if (shortName.length > RESOURCE_TYPE_SHORT_NAME_MAX_LEN) {
    throw new Error(
      `Resource short name is more than ${RESOURCE_TYPE_SHORT_NAME_MAX_LEN} characters`
    );
  }
  return shortName
    .padEnd(RESOURCE_TYPE_SHORT_NAME_MAX_LEN, RESOURCE_TYPE_SHORT_NAME_PADDING)
    .toLowerCase();
}

export const kFimidaraResourceType = {
  All: "*",
  System: "system",
  Public: "public",
  Workspace: "workspace",
  CollaborationRequest: "collaborationRequest",
  AgentToken: "agentToken",
  PermissionGroup: "permissionGroup",
  PermissionItem: "permissionItem",
  Folder: "folder",
  File: "file",
  User: "user",
  Tag: "tag",
  UsageRecord: "usageRecord",
  AssignedItem: "assignedItem",
  EndpointRequest: "endpointRequest",
  Job: "job",
  PresignedPath: "presignedPath",
  FileBackendConfig: "fileBackendConfig",
  FileBackendMount: "fileBackendMount",
  ResolvedMountEntry: "resolvedMountEntry",
  App: "app",
} as const;
export const RESOURCE_TYPE_SHORT_NAMES: Record<FimidaraResourceType, string> = {
  [kFimidaraResourceType.All]: padShortName("*"),
  [kFimidaraResourceType.System]: padShortName("system"),
  [kFimidaraResourceType.Public]: padShortName("public"),
  [kFimidaraResourceType.Workspace]: padShortName("wrkspce"),
  [kFimidaraResourceType.CollaborationRequest]: padShortName("corqst"),
  [kFimidaraResourceType.AgentToken]: padShortName("agtoken"),
  [kFimidaraResourceType.PermissionGroup]: padShortName("pmgroup"),
  [kFimidaraResourceType.PermissionItem]: padShortName("prmitem"),
  [kFimidaraResourceType.Folder]: padShortName("folder"),
  [kFimidaraResourceType.File]: padShortName("file"),
  [kFimidaraResourceType.User]: padShortName("user"),
  [kFimidaraResourceType.Tag]: padShortName("tag"),
  [kFimidaraResourceType.UsageRecord]: padShortName("urecord"),
  [kFimidaraResourceType.Job]: padShortName("job"),
  [kFimidaraResourceType.PresignedPath]: padShortName("presgnd"),
  [kFimidaraResourceType.FileBackendConfig]: padShortName("bckconf"),
  [kFimidaraResourceType.FileBackendMount]: padShortName("mount"),
};

export class InvalidResourceIdError extends Error {
  name = "InvalidResourceIdError";
  message = "Invalid resource ID";
}

export function getResourceId(d: { resourceId: string }) {
  return d.resourceId;
}
