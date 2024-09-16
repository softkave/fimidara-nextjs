"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileComponent from "@/components/app/workspaces/files/FileComponent";
import FileContainer from "@/components/app/workspaces/files/FileContainer";
import React from "react";

export type IFilePageProps = {
  params: { workspaceId: string; fileId: string };
};

const FilePage: React.FC<IFilePageProps> = (props) => {
  const { workspaceId, fileId } = props.params;
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => {
        return (
          <FileContainer
            fileId={fileId}
            workspaceId={workspaceId}
            render={(file) => (
              <FileComponent
                file={file}
                workspaceRootname={workspace.rootname}
              />
            )}
          />
        );
      }}
    />
  );
};

export default FilePage;
