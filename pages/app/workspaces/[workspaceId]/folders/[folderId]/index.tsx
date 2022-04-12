import { GetServerSideProps } from "next";
import React from "react";
import FileListContainer from "../../../../../../components/app/workspaces/files/FileListContainer";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IFolderFilesPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderFilesPage: React.FC<IFolderFilesPageProps> = (props) => {
  const { workspaceId, folderId } = props;
  const renderForm = React.useCallback(
    (folder: IFolder) => {
      return <FileListContainer workspaceId={workspaceId} folder={folder} />;
    },
    [workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderContainer
        folderId={folderId}
        workspaceId={workspaceId}
        render={renderForm}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(FolderFilesPage);

export const getServerSideProps: GetServerSideProps<
  IFolderFilesPageProps,
  IFolderFilesPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      folderId: context.params!.folderId,
    },
  };
};
