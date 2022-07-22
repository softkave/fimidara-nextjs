import { GetServerSideProps } from "next";
import React from "react";
import FileListContainer from "../../../../../../components/app/workspaces/files/FileListContainer";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import { IWorkspace } from "../../../../../../lib/definitions/workspace";

export type IFolderFilesPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderFilesPage: React.FC<IFolderFilesPageProps> = (props) => {
  const { workspaceId, folderId } = props;
  const renderFolderContainer = React.useCallback(
    (workspace: IWorkspace) => {
      return (
        <FolderContainer
          folderId={folderId}
          render={(folder) => {
            return (
              <FileListContainer
                workspaceId={workspaceId}
                folder={folder}
                workspaceRootname={workspace.rootname}
              />
            );
          }}
        />
      );
    },
    [workspaceId, folderId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      render={renderFolderContainer}
    />
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
