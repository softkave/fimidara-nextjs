import { GetServerSideProps } from "next";
import React from "react";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import PermissionGroup from "../../../../../../components/app/workspaces/permissionGroups/PermissionGroup";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IWorkspacePermissionGroupPageProps = {
  workspaceId: string;
  presetId: string;
};

const WorkspacePermissionGroupPage: React.FC<
  IWorkspacePermissionGroupPageProps
> = (props) => {
  const { workspaceId, presetId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.permissionGroupList(workspaceId)}
    >
      <PermissionGroup presetId={presetId} />
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspacePermissionGroupPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspacePermissionGroupPageProps,
  IWorkspacePermissionGroupPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      presetId: context.params!.presetId,
    },
  };
};
