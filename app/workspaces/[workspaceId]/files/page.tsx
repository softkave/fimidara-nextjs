"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderChildren from "@/components/app/workspaces/files/FolderChildren";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import React, { use } from "react";

export interface IWorkspaceFilesPageProps extends IWorkspaceComponentProps {}

const WorkspaceFilePage: React.FC<IWorkspaceFilesPageProps> = (props) => {
  const { workspaceId } = use(props.params);
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <FolderChildren
          workspaceId={workspace.resourceId}
          workspaceRootname={workspace.rootname}
        />
      )}
    />
  );
};

export default WorkspaceFilePage;
