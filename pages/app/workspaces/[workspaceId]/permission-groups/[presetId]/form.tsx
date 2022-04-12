import { GetServerSideProps } from "next";
import React from "react";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import PresetForm from "../../../../../../components/app/workspaces/permissionGroups/PresetForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import usePermissionGroup from "../../../../../../lib/hooks/workspaces/usePermissionGroup";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IWorkspacePresetFormPageProps = {
  workspaceId: string;
  presetId: string;
};

const WorkspacePresetFormPage: React.FC<IWorkspacePresetFormPageProps> = (
  props
) => {
  const { workspaceId, presetId } = props;
  const { error, isLoading, data } = usePermissionGroup(presetId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission group..." />;
  } else {
    content = (
      <PresetForm workspaceId={data.preset.workspaceId} preset={data.preset} />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.permissionGroupList(workspaceId)}
    >
      {content}
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspacePresetFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspacePresetFormPageProps,
  IWorkspacePresetFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      presetId: context.params!.presetId,
    },
  };
};
