"use client";

import FileForm from "@/components/app/workspaces/files/FileForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const CreateRootLevelFileFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceContainer
        workspaceId={workspaceId}
        render={(workspace) => (
          <FileForm
            workspaceId={workspaceId}
            workspaceRootname={workspace.rootname}
          />
        )}
      />
    ),
  });
};

export default CreateRootLevelFileFormPage;
