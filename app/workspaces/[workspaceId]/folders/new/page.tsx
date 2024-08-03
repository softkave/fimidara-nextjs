"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderForm from "@/components/app/workspaces/files/FolderForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const CreateRootLevelFolderFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceContainer
        workspaceId={workspaceId}
        render={(workspace) => {
          return (
            <FolderForm
              workspaceId={workspaceId}
              workspaceRootname={workspace.rootname}
            />
          );
        }}
      />
    ),
  });
};

export default CreateRootLevelFolderFormPage;
