import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useWorkspaceCollaboratorFetchHook } from "@/lib/hooks/fetchHooks/workspaceCollaborator.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { getBaseError } from "@/lib/utils/errors";
import { Collaborator } from "fimidara";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import CollaboratorMenu from "./CollaboratorMenu";

export interface CollaboratorComponentProps {
  workspaceId: string;
  collaboratorId: string;
}

function CollaboratorComponent(props: CollaboratorComponentProps) {
  const { collaboratorId, workspaceId } = props;
  const router = useRouter();
  const { fetchState } = useWorkspaceCollaboratorFetchHook({
    workspaceId,
    collaboratorId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  const onCompeleteRemoveCollaborator = useCallback(async () => {
    router.push(kAppWorkspacePaths.collaboratorList(workspaceId));
  }, [workspaceId, router]);

  if (resource) {
    return (
      <div>
        <div className="space-y-4">
          <ComponentHeader title={resource.firstName + " " + resource.lastName}>
            <CollaboratorMenu
              workspaceId={workspaceId}
              collaborator={resource as Collaborator}
              onCompleteRemove={onCompeleteRemoveCollaborator}
            />
          </ComponentHeader>
          <LabeledNode
            nodeIsText
            copyable
            direction="vertical"
            label="Resource ID"
            node={resource.resourceId}
          />
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Name"
            node={resource.firstName + " " + resource.lastName}
          />
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Email Address"
            node={resource.email}
          />
          <AssignedPermissionGroupList
            entityId={resource.resourceId}
            workspaceId={resource.workspaceId}
          />
        </div>
      </div>
    );
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching collaborator"}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading resource..." />;
  } else {
    return <PageNothingFound message="Collaborator not found" />;
  }
}

export default CollaboratorComponent;
