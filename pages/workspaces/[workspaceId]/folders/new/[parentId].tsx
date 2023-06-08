import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import FolderForm from "@/components/app/workspaces/files/FolderForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { folderConstants } from "@/lib/definitions/folder";
import { GetServerSideProps } from "next";
import React from "react";

export type ICreateFolderWithParentFormPageProps = {
  workspaceId: string;
  parentId: string;
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { workspaceId, parentId } = props;

  return (
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
                parentPath={folder.namePath.join(folderConstants.nameSeparator)}
              />
            )}
          />
        );
      }}
    />
  );
};

export default withPageAuthRequiredHOC(CreateFolderWithParentFormPage);

export const getServerSideProps: GetServerSideProps<
  ICreateFolderWithParentFormPageProps,
  ICreateFolderWithParentFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      parentId: context.params!.parentId,
    },
  };
};
