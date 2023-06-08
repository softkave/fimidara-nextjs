import PermissionGroupForm from "@/components/app/workspaces/permissionGroups/PermissionGroupForm";
import {
  IWorkspaceComponentProps,
  getWorkspaceServerSideProps,
} from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

const WorkspaceCreatePermissionGroupFormPage: React.FC<
  IWorkspaceComponentProps
> = (props) => {
  const { workspaceId } = props;
  return <PermissionGroupForm workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceCreatePermissionGroupFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
