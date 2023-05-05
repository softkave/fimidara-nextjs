import PermissionGroup from "@/components/app/workspaces/permissionGroups/PermissionGroup";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspacePermissionGroupPageProps = {
  workspaceId: string;
  permissionGroupId: string;
};

const WorkspacePermissionGroupPage: React.FC<
  IWorkspacePermissionGroupPageProps
> = (props) => {
  const { workspaceId, permissionGroupId } = props;
  return <PermissionGroup permissionGroupId={permissionGroupId} />;
};

export default withPageAuthRequiredHOC(WorkspacePermissionGroupPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspacePermissionGroupPageProps,
  IWorkspacePermissionGroupPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      permissionGroupId: context.params!.permissionGroupId,
    },
  };
};
