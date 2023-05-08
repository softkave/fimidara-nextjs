import { isArray, last } from "lodash";

export const folderConstants = {
  minFolderNameLength: 1,
  maxFolderNameLength: 70,
  maxFolderDepth: 10,
  nameSeparator: "/",
};

export function addRootnameToPath<
  T extends string | string[] = string | string[]
>(path: T, workspaceRootname: string | string[]): T {
  const rootname = isArray(workspaceRootname)
    ? last(workspaceRootname)
    : workspaceRootname;

  if (isArray(path)) {
    return <T>[rootname, ...path];
  }

  return <T>`${rootname}${folderConstants.nameSeparator}${path}`;
}
