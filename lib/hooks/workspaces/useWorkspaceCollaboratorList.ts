import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
  IGetWorkspaceCollaboratorsEndpointParams,
  IGetWorkspaceCollaboratorsEndpointResult,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";
import { swrDefaultConfig } from "../config";

const fetcher = async (
  p: string,
  q: IGetWorkspaceCollaboratorsEndpointParams
) => {
  return checkEndpointResult(
    await CollaboratorAPI.getWorkspaceCollaborators(q)
  );
};

export function getUseWorkspaceCollaboratorListHookKey(
  q: IGetWorkspaceCollaboratorsEndpointParams
) {
  return [CollaboratorURLs.getWorkspaceCollaborators, q];
}

export default function useWorkspaceCollaboratorList(
  q: IGetWorkspaceCollaboratorsEndpointParams
) {
  const { data, error } = useSWR<IGetWorkspaceCollaboratorsEndpointResult>(
    getUseWorkspaceCollaboratorListHookKey(q),
    fetcher,
    swrDefaultConfig
  );
  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
