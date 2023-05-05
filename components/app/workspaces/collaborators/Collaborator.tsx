import { appWorkspacePaths } from "@/lib/definitions/system";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import { Collaborator } from "fimidara";
import { useRouter } from "next/router";
import React from "react";
import { useWorkspaceCollaboratorFetchHook } from "../../../../lib/hooks/fetchHooks";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import CollaboratorMenu from "./CollaboratorMenu";

export interface ICollaboratorProps {
  workspaceId: string;
  collaboratorId: string;
}

function Collaborator(props: ICollaboratorProps) {
  const { collaboratorId, workspaceId } = props;
  const router = useRouter();
  const data = useWorkspaceCollaboratorFetchHook({
    workspaceId,
    collaboratorId,
  });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  const onCompeleteRemoveCollaborator = React.useCallback(async () => {
    router.push(appWorkspacePaths.collaboratorList(workspaceId));
  }, [workspaceId, router]);

  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching collaborator"}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading resource..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Collaborator not found." />;
  }

  return (
    <div className={appClasses.main}>
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
}

export default Collaborator;
