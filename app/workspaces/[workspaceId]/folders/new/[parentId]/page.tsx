"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import FolderForm from "@/components/app/workspaces/files/FolderForm";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { folderConstants } from "@/lib/definitions/folder";
import React from "react";

export type ICreateFolderWithParentFormPageProps = {
  params: { workspaceId: string; parentId: string };
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { workspaceId, parentId } = props.params;

  return usePageAuthRequired({
    render: () => (
      <FolderContainer
        folderId={parentId}
        render={(folder) => {
          return (
            <WorkspaceContainer
              workspaceId={workspaceId}
              render={(workspace) => (
                <FolderForm
                  workspaceRootname={workspace.rootname}
                  workspaceId={workspaceId}
                  parentId={parentId}
                  parentPath={folder.namepath.join(
                    folderConstants.nameSeparator
                  )}
                />
              )}
            />
          );
        }}
      />
    ),
  });
};

export default CreateFolderWithParentFormPage;
