import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPresetList from "../permissionGroups/AssignedPresetList";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useCollaborator from "../../../../lib/hooks/workspaces/useCollaborator";
import { useSWRConfig } from "swr";
import { getUseWorkspaceCollaboratorListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceCollaboratorList";
import CollaboratorMenu from "./CollaboratorMenu";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";
import { getBaseError } from "../../../../lib/utilities/errors";

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
  //   async (presetId: string) => {
  //     assert(data?.collaborator, new Error("Collaborator not found"));
  //     const updatedPresets = data.collaborator.presets.filter(
  //       (item) => item.presetId !== presetId
  //     );

  //     const result = await CollaboratorAPI.updateCollaboratorPresets({
  //       collaboratorId,
  //       workspaceId: workspaceId,
  //       presets: updatedPresets,
  //     });

  //     mutate(result, false);
  //   },
  //   [data, workspaceId, collaboratorId]
  // );

  const onCompeleteRemoveCollaborator = React.useCallback(async () => {
    cacheMutate(getUseWorkspaceCollaboratorListHookKey(workspaceId));
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
        <AssignedPresetList
          workspaceId={workspaceId}
          presets={collaborator.presets || []}
        />
      </Space>
    </div>
  );
}

export default Collaborator;
