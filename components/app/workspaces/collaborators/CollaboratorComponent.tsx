import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaboratorFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import { Collaborator as CollaboratorComponent } from "fimidara";
import { useRouter } from "next/router";
import React from "react";
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

  const onCompeleteRemoveCollaborator = React.useCallback(async () => {
    router.push(appWorkspacePaths.collaboratorList(workspaceId));
  }, [workspaceId, router]);

  if (resource) {
    return (
      <div>
        <Space direction="vertical" size={32} style={{ width: "100%" }}>
          <ComponentHeader title={resource.firstName + " " + resource.lastName}>
            <CollaboratorMenu
              workspaceId={workspaceId}
              collaborator={resource as CollaboratorComponent}
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
        </Space>
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
    return <PageNothingFound message="Collaborator not found." />;
  }
}

export default CollaboratorComponent;
