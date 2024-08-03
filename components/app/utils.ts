import { RESOURCE_TYPE_SHORT_NAMES } from "../../lib/utils/resource.ts";

export function getWorkspaceId(path: string) {
  const [empty01, p01, workspaceId] = path.split("/");
  const isWorkspace = workspaceId?.includes(
    RESOURCE_TYPE_SHORT_NAMES["workspace"]
  );
  if (isWorkspace) return workspaceId;
}
