import { Space } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useCollaborator from "../../../../lib/hooks/workspaces/useCollaborator";
import { getUseWorkspaceCollaboratorListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceCollaboratorList";
import { getBaseError } from "../../../../lib/utils/errors";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import CollaboratorMenu from "./CollaboratorMenu";

export interface ICollaboratorProps {
  workspaceId: string;
  collaboratorId: string;
}

function Collaborator(props: ICollaboratorProps) {
  const { collaboratorId, workspaceId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useCollaborator(
    workspaceId,
    collaboratorId
  );

  const { mutate: cacheMutate } = useSWRConfig();
  // const onRemovePermissionGroup = React.useCallback(
  //   async (permissionGroupId: string) => {
  //     assert(data?.collaborator, new Error("Collaborator not found"));
  //     const updatedPermissionGroups = data.collaborator.permissionGroups.filter(
  //       (item) => item.permissionGroupId !== permissionGroupId
  //     );

  //     const result = await CollaboratorAPI.updateCollaboratorPermissionGroups({
  //       collaboratorId,
  //       workspaceId: workspaceId,
  //       permissionGroups: updatedPermissionGroups,
  //     });

  //     mutate(result, false);
  //   },
  //   [data, workspaceId, collaboratorId]
  // );

  const onCompeleteRemoveCollaborator = React.useCallback(async () => {
    cacheMutate(getUseWorkspaceCollaboratorListHookKey({ workspaceId }));
    router.push(appWorkspacePaths.collaboratorList(workspaceId));
  }, [workspaceId, router, cacheMutate]);

  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching collaborator"}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading collaborator..." />;
  }

  const collaborator = data.collaborator;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader
          title={collaborator.firstName + " " + collaborator.lastName}
        >
          <CollaboratorMenu
            workspaceId={workspaceId}
            collaborator={collaborator}
            onCompleteRemove={onCompeleteRemoveCollaborator}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={collaborator.resourceId}
        />
        <AssignedPermissionGroupList
          workspaceId={workspaceId}
          permissionGroups={collaborator.permissionGroups || []}
        />
      </Space>
    </div>
  );
}

export default Collaborator;
