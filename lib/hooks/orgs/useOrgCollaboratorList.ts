import useSWR from "swr";
import CollaboratorAPI, {
  CollaboratorURLs,
} from "../../api/endpoints/collaborators";
import { checkEndpointResult } from "../../api/utils";

const fetcher = async (p: string, orgId: string) => {
  return checkEndpointResult(
    await CollaboratorAPI.getOrganizationCollaborators({
      organizationId: orgId,
    })
  );
};

export function getUseOrgCollaboratorListHookKey(orgId: string) {
  return [CollaboratorURLs.getOrganizationCollaborators, orgId];
}

export default function useOrgCollaboratorList(orgId: string) {
  const { data, error } = useSWR(
    getUseOrgCollaboratorListHookKey(orgId),
    fetcher
  );

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
