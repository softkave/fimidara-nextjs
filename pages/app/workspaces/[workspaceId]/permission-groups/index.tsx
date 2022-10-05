import React from "react";
import WorkspacePermissionGroups from "../../../../../components/app/workspaces/permissionGroups/WorkspacePermissionGroups";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspacePermissionGroupsPageProps {
  workspaceId: string;
}

const WorkspacePermissionGroupsPage: React.FC<
  IWorkspacePermissionGroupsPageProps
> = (props) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.permissionGroupList(workspaceId)}
    >
      <WorkspacePermissionGroups workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspacePermissionGroupsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
