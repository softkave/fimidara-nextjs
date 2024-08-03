"use client";

import WorkspacePermissionGroups from "@/components/app/workspaces/permissionGroups/WorkspacePermissionGroups";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export interface IWorkspacePermissionGroupsPageProps
  extends IWorkspaceComponentProps {}

const WorkspacePermissionGroupsPage: React.FC<
  IWorkspacePermissionGroupsPageProps
> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => <WorkspacePermissionGroups workspaceId={workspaceId} />,
  });
};

export default WorkspacePermissionGroupsPage;
