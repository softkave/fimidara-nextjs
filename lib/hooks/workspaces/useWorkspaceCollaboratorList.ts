import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, workspaceId: string) => {
  return checkEndpointResult(
    await CollaboratorAPI.getWorkspaceCollaborators({
      workspaceId: workspaceId,
    })
  );
};

export function getUseWorkspaceCollaboratorListHookKey(workspaceId: string) {
  return [CollaboratorURLs.getWorkspaceCollaborators, workspaceId];
}

export default function useWorkspaceCollaboratorList(workspaceId: string) {
  const { data, error } = useSWR(
    getUseWorkspaceCollaboratorListHookKey(workspaceId),
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
