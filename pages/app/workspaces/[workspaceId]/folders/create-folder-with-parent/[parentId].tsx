import { GetServerSideProps } from "next";
import React from "react";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import FolderForm from "../../../../../../components/app/workspaces/files/FolderForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type ICreateFolderWithParentFormPageProps = {
  workspaceId: string;
  parentId: string;
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { workspaceId, parentId } = props;
  const renderForm = React.useCallback((folder: IFolder) => {
    return (
      <FolderForm
        workspaceId={workspaceId}
        parentId={parentId}
        parentPath={folder.namePath.join(folderConstants.nameSeparator)}
      />
    );
  }, []);

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderContainer
        workspaceId={workspaceId}
        folderId={parentId}
        render={renderForm}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(CreateFolderWithParentFormPage);

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
