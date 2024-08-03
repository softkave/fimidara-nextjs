"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileContainer from "@/components/app/workspaces/files/FileContainer";
import FileForm from "@/components/app/workspaces/files/FileForm";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IUpdateFileFormPageProps = {
  params: { workspaceId: string; fileId: string };
};

const UpdateFileFormPage: React.FC<IUpdateFileFormPageProps> = (props) => {
  const { workspaceId, fileId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <FileContainer
        fileId={fileId}
        workspaceId={workspaceId}
        render={(file) => {
          return (
            <WorkspaceContainer
              workspaceId={workspaceId}
              render={(workspace) => (
                <FileForm
                  workspaceId={workspaceId}
                  file={file}
                  workspaceRootname={workspace.rootname}
                />
              )}
            />
          );
        }}
      />
    ),
  });
};

export default UpdateFileFormPage;
