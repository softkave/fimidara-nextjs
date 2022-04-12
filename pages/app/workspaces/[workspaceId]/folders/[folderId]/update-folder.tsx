import { GetServerSideProps } from "next";
import React from "react";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import FolderForm from "../../../../../../components/app/workspaces/files/FolderForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IUpdateFolderFormPageProps = {
  workspaceId: string;
  folderId: string;
};

const UpdateFolderFormPage: React.FC<IUpdateFolderFormPageProps> = (props) => {
  const { workspaceId, folderId } = props;
  const renderForm = React.useCallback(
    (folder: IFolder) => {
      return <FolderForm workspaceId={workspaceId} folder={folder} />;
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

export default withPageAuthRequired(UpdateFolderFormPage);

export const getServerSideProps: GetServerSideProps<
  IUpdateFolderFormPageProps,
  IUpdateFolderFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      folderId: context.params!.folderId,
    },
  };
};
