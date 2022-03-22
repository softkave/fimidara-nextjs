import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string, id: string) => {
  return checkEndpointResult(
    await CollaboratorAPI.getCollaborator({
      collaboratorId: id,
      organizationId: orgId,
    })
  );
};

export function getUseCollaboratorHookKey(orgId: string, id: string) {
  return [CollaboratorURLs.getCollaborator, orgId, id];
}

export default function useCollaborator(orgId: string, id?: string) {
  const { data, error, mutate } = useSWR(
    id ? getUseCollaboratorHookKey(orgId, id) : null,
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
