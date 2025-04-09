"use client";

import PermissionGroupComponent from "@/components/app/workspaces/permissionGroups/PermissionGroupComponent";
import React, { use } from "react";

export type IWorkspacePermissionGroupPageProps = {
  params: Promise<{ workspaceId: string; permissionGroupId: string }>;
};

const WorkspacePermissionGroupPage: React.FC<
  IWorkspacePermissionGroupPageProps
> = (props) => {
  const { permissionGroupId } = use(props.params);
  return <PermissionGroupComponent permissionGroupId={permissionGroupId} />;
};

export default WorkspacePermissionGroupPage;
