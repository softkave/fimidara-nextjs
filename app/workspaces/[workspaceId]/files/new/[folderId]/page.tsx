"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileForm from "@/components/app/workspaces/files/FileForm";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { folderConstants } from "@/lib/definitions/folder";
import React from "react";

export type ICreateFileInFolderParentFormPageProps = {
  params: { workspaceId: string; folderId: string };
};

const CreateFileInFolderParentFormPage: React.FC<
  ICreateFileInFolderParentFormPageProps
> = (props) => {
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
                <FileForm
                  workspaceRootname={workspace.rootname}
                  workspaceId={workspaceId}
                  folderpath={folder.namepath.join(
                    folderConstants.nameSeparator
                  )}
                  key="file-form"
                />
              )}
            />
          );
        }}
      />
    ),
  });
};

export default CreateFileInFolderParentFormPage;
