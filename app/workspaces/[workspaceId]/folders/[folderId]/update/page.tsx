"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import FolderForm from "@/components/app/workspaces/files/FolderForm";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IUpdateFolderFormPageProps = {
  params: { workspaceId: string; folderId: string };
};

const UpdateFolderFormPage: React.FC<IUpdateFolderFormPageProps> = (props) => {
  const { workspaceId, folderId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <FolderContainer
        folderId={folderId}
        render={(folder) => {
          return (
            <WorkspaceContainer
              workspaceId={workspaceId}
              render={(workspace) => (
                <FolderForm
                  workspaceId={workspaceId}
                  folder={folder}
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

export default UpdateFolderFormPage;
