"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderComponent from "@/components/app/workspaces/files/FolderComponent";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IFolderPageProps = {
  params: { workspaceId: string; folderId: string };
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { workspaceId, folderId } = props.params;
  return usePageAuthRequired({
    render: () => (
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
    ),
  });
};

export default FolderPage;
