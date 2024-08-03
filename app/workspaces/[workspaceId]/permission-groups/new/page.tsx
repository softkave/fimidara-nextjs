"use client";

import PermissionGroupForm from "@/components/app/workspaces/permissionGroups/PermissionGroupForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const WorkspaceCreatePermissionGroupFormPage: React.FC<
  IWorkspaceComponentProps
> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => <PermissionGroupForm workspaceId={workspaceId} />,
  });
};

export default WorkspaceCreatePermissionGroupFormPage;
