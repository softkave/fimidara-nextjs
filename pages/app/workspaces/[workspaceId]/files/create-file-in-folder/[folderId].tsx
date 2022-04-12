import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../../components/app/workspaces/files/FileForm";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type ICreateFileInFolderParentFormPageProps = {
  workspaceId: string;
  folderId: string;
};

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const CreateFileInFolderParentFormPage: React.FC<
  ICreateFileInFolderParentFormPageProps
> = (props) => {
  const { workspaceId, folderId } = props;
  const renderForm = React.useCallback((folder: IFolder) => {
    return (
      <FileForm
        workspaceId={workspaceId}
        folderId={folderId}
        folderpath={folder.namePath.join(folderConstants.nameSeparator)}
        key="file-form"
      />
    );
  }, []);

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderContainer
        folderId={folderId}
        workspaceId={workspaceId}
        render={renderForm}
        fetchConfig={swrConfig}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(CreateFileInFolderParentFormPage, {
  swrConfig,
});

export const getServerSideProps: GetServerSideProps<
  ICreateFileInFolderParentFormPageProps,
  ICreateFileInFolderParentFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      folderId: context.params!.folderId,
    },
  };
};
