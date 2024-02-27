import WorkspacePermissionGroups from "@/components/app/workspaces/permissionGroups/WorkspacePermissionGroups";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspacePermissionGroupsPageProps {
  workspaceId: string;
}

const WorkspacePermissionGroupsPage: React.FC<
  IWorkspacePermissionGroupsPageProps
> = (props) => {
  const { workspaceId } = props;
  return <WorkspacePermissionGroups workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspacePermissionGroupsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
