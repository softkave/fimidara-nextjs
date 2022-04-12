import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, workspaceId: string, id: string) => {
  return checkEndpointResult(
    await CollaboratorAPI.getCollaborator({
      collaboratorId: id,
      workspaceId: workspaceId,
    })
  );
};

export function getUseCollaboratorHookKey(workspaceId: string, id: string) {
  return [CollaboratorURLs.getCollaborator, workspaceId, id];
}

export default function useCollaborator(workspaceId: string, id?: string) {
  const { data, error, mutate } = useSWR(
    id ? getUseCollaboratorHookKey(workspaceId, id) : null,
    fetcher,
    { shouldRetryOnError: false }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
