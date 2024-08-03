"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderChildren from "@/components/app/workspaces/files/FolderChildren";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export interface IWorkspaceFoldersPageProps extends IWorkspaceComponentProps {}

const WorkspaceFoldersPage: React.FC<IWorkspaceFoldersPageProps> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceContainer
        workspaceId={workspaceId}
        render={(workspace) => (
          <FolderChildren
            workspaceId={workspace.resourceId}
            workspaceRootname={workspace.rootname}
          />
        )}
      />
    ),
  });
};

export default WorkspaceFoldersPage;
