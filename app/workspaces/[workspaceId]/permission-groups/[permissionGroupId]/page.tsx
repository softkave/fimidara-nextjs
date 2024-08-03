"use client";

import PermissionGroupComponent from "@/components/app/workspaces/permissionGroups/PermissionGroupComponent";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspacePermissionGroupPageProps = {
  params: { workspaceId: string; permissionGroupId: string };
};

const WorkspacePermissionGroupPage: React.FC<
  IWorkspacePermissionGroupPageProps
> = (props) => {
  const { permissionGroupId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <PermissionGroupComponent permissionGroupId={permissionGroupId} />
    ),
  });
};

export default WorkspacePermissionGroupPage;
