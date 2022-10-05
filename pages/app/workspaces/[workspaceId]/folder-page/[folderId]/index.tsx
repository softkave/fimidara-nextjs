import { GetServerSideProps } from "next";
import React from "react";
import Folder from "../../../../../../components/app/workspaces/files/Folder";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import { IWorkspace } from "../../../../../../lib/definitions/workspace";

export type IFolderPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { workspaceId, folderId } = props;
  const renderFolder = React.useCallback(
    (workspace: IWorkspace) => {
      return (
        <FolderContainer
          folderId={folderId}
          render={(folder) => (
            <Folder folder={folder} workspaceRootname={workspace.rootname} />
          )}
        />
      );
    },
    [folderId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      render={renderFolder}
    />
  );
};

export default withPageAuthRequiredHOC(FolderPage);

export const getServerSideProps: GetServerSideProps<
  IFolderPageProps,
  IFolderPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      folderId: context.params!.folderId,
    },
  };
};
