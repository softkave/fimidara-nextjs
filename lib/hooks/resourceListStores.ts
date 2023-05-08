import {
  AgentToken,
  CollaborationRequestForUser,
  CollaborationRequestForWorkspace,
  Collaborator,
  File,
  Folder,
  PermissionGroup,
  PublicUser,
  UsageRecord,
  Workspace,
} from "fimidara";
import { makeKey } from "../utils/fns";
import { makeResourceListStore } from "./makeResourceListStore";

export const useUsersStore = makeResourceListStore<PublicUser>();
export const useUserCollaborationRequestsStore =
  makeResourceListStore<CollaborationRequestForUser>();
export const useWorkspaceCollaboratorsStore =
  makeResourceListStore<Collaborator>();
export const useWorkspaceCollaborationRequestsStore =
  makeResourceListStore<CollaborationRequestForWorkspace>();
export const useWorkspaceAgentTokensStore = makeResourceListStore<AgentToken>();
export const useWorkspaceFilesStore = makeResourceListStore<File>();
export const useWorkspaceFoldersStore = makeResourceListStore<Folder>();
export const useWorkspacePermissionGroupsStore =
  makeResourceListStore<PermissionGroup>();
export const useWorkspaceUsageRecordsStore =
  makeResourceListStore<UsageRecord>();
export const useWorkspacesStore = makeResourceListStore<Workspace>();

export function getFolderByPath(
  folderpath: string,
  includesWorkspaceRootname: boolean
) {
  const isFolderpathMatch = (f1: string[], f2: string[]) =>
    f1.every((name, index) => name === f2[index]);

  folderpath = includesWorkspaceRootname
    ? folderpath.startsWith("/")
      ? folderpath.slice(1)
      : folderpath
    : folderpath.startsWith("/")
    ? folderpath
    : "/" + folderpath;
  const [workspaceRootnameOrEmpty, ...restFolderpathList] =
    folderpath.split("/");
  return Object.values(useWorkspaceFoldersStore.getState().items).find(
    (nextFolder) => isFolderpathMatch(nextFolder.namePath, restFolderpathList)
  );
}

export function getFileByPath(
  filepath: string,
  includesWorkspaceRootname: boolean
) {
  const isFilepathMatch = (f1: string[], f2: string[]) =>
    f1.every((name, index) => name === f2[index]);

  filepath = includesWorkspaceRootname
    ? filepath.startsWith("/")
      ? filepath.slice(1)
      : filepath
    : filepath.startsWith("/")
    ? filepath
    : "/" + filepath;
  const [workspaceRootnameOrEmpty, ...restFilepathList] = filepath.split("/");
  return Object.values(useWorkspaceFilesStore.getState().items).find(
    (nextFile) => isFilepathMatch(nextFile.namePath, restFilepathList)
  );
}

const kCollaboratorKeySeparator = "/";
export function getCollaboratorStoreKey(
  collaborator: Pick<Collaborator, "resourceId" | "workspaceId">
) {
  return makeKey(
    [collaborator.workspaceId, collaborator.resourceId],
    kCollaboratorKeySeparator
  );
}
export function splitCollaboratorKey(key: string) {
  const [workspaceId, resourceId] = key.split(kCollaboratorKeySeparator);
  return { workspaceId, resourceId };
}

export function clearResourceListStores() {
  useUsersStore.getState().clear();
  useUserCollaborationRequestsStore.getState().clear();
  useWorkspaceCollaboratorsStore.getState().clear();
  useWorkspaceCollaborationRequestsStore.getState().clear();
  useWorkspaceAgentTokensStore.getState().clear();
  useWorkspaceFilesStore.getState().clear();
  useWorkspaceFoldersStore.getState().clear();
  useWorkspacePermissionGroupsStore.getState().clear();
  useWorkspaceUsageRecordsStore.getState().clear();
  useWorkspacesStore.getState().clear();
}
