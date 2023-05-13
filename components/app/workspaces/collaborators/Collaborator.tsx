import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaboratorFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import { Collaborator } from "fimidara";
import { useRouter } from "next/router";
import React from "react";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/page/PageError";
import PageLoading from "../../../utils/page/PageLoading";
import PageNothingFound from "../../../utils/page/PageNothingFound";
import CollaboratorMenu from "./CollaboratorMenu";

export interface ICollaboratorProps {
  workspaceId: string;
  collaboratorId: string;
}

function Collaborator(props: ICollaboratorProps) {
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

export default Collaborator;
