import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
  IGetWorkspaceCollaboratorsEndpointResult,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

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
  const { data, error } = useSWR<IGetWorkspaceCollaboratorsEndpointResult>(
    getUseWorkspaceCollaboratorListHookKey(workspaceId),
    fetcher,
    swrDefaultConfig
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
