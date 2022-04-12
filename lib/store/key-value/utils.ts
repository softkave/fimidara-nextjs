import { KeyValueKeys } from "./types";

export class KeyValueDynamicKeys {
  static getWorkspaceImageLastUpdateTime = (workspaceId: string) =>
    `${KeyValueKeys.WorkspaceImageLastUpdateTime}_${workspaceId}`;
}
