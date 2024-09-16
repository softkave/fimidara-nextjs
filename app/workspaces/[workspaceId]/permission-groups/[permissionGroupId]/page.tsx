"use client";

import PermissionGroupComponent from "@/components/app/workspaces/permissionGroups/PermissionGroupComponent";
import React from "react";

export type IWorkspacePermissionGroupPageProps = {
  params: { workspaceId: string; permissionGroupId: string };
};

const WorkspacePermissionGroupPage: React.FC<
  IWorkspacePermissionGroupPageProps
> = (props) => {
  const { permissionGroupId } = props.params;
  return <PermissionGroupComponent permissionGroupId={permissionGroupId} />;
};

export default WorkspacePermissionGroupPage;
