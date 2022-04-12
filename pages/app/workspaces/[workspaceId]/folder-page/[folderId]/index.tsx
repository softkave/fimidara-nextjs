import { GetServerSideProps } from "next";
import React from "react";
import Folder from "../../../../../../components/app/workspaces/files/Folder";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IFolderPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { workspaceId, folderId } = props;
  const renderFolder = React.useCallback(
    (folder: IFolder) => {
      return <Folder folder={folder} />;
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
        render={renderFolder}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(FolderPage);

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
