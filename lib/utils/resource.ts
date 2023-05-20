import { WorkspaceAppResourceType } from "fimidara";
import { invert } from "lodash";
import { InvertRecord } from "./types";

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

export const RESOURCE_TYPE_SHORT_NAMES: Record<
  WorkspaceAppResourceType,
  string
> = {
  ["*"]: padShortName("*"),
  ["workspace"]: padShortName("wrkspce"),
  ["collaborationRequest"]: padShortName("corqst"),
  ["agentToken"]: padShortName("agtoken"),
  ["permissionGroup"]: padShortName("pmgroup"),
  ["permissionItem"]: padShortName("prmitem"),
  ["folder"]: padShortName("folder"),
  ["file"]: padShortName("file"),
  ["user"]: padShortName("user"),
  ["tag"]: padShortName("tag"),
  ["usageRecord"]: padShortName("urecord"),
};

const SHORT_NAME_TO_RESOURCE_TYPE = invert(
  RESOURCE_TYPE_SHORT_NAMES
) as InvertRecord<typeof RESOURCE_TYPE_SHORT_NAMES>;

export class InvalidResourceIdError extends Error {
  name = "InvalidResourceIdError";
  message = "Invalid resource ID.";
}

export function isAppResourceId(resourceId: string) {
  const shortName = resourceId.slice(0, RESOURCE_TYPE_SHORT_NAME_MAX_LEN);
  if (!shortName ?? !SHORT_NAME_TO_RESOURCE_TYPE[shortName]) {
    return false;
  }
  return true;
}

export function tryGetResourceTypeFromId(
  id: string
): WorkspaceAppResourceType | undefined {
  const shortName = id.slice(0, RESOURCE_TYPE_SHORT_NAME_MAX_LEN);
  const type = SHORT_NAME_TO_RESOURCE_TYPE[shortName];
  return type;
}

export function getResourceTypeFromId(id: string) {
  const type = tryGetResourceTypeFromId(id);
  if (!type) {
    throw new InvalidResourceIdError();
  }
  return type;
}
