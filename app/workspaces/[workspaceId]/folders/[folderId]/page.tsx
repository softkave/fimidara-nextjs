"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderComponent from "@/components/app/workspaces/files/FolderComponent";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import React, { use } from "react";

export type IFolderPageProps = {
  params: Promise<{ workspaceId: string; folderId: string }>;
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { folderId, workspaceId } = use(props.params);
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <FolderContainer
          folderId={folderId}
          render={(folder) => {
            return (
              <FolderComponent
                folder={folder}
                workspaceRootname={workspace.rootname}
              />
            );
          }}
        />
      )}
    />
  );
};

export default FolderPage;
