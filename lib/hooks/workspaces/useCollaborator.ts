import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
  IGetCollaboratorEndpointResult,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

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
  const { data, error, mutate } = useSWR<IGetCollaboratorEndpointResult>(
    id ? getUseCollaboratorHookKey(workspaceId, id) : null,
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
