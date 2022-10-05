import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../../components/app/workspaces/files/FileForm";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import WorkspaceContainer from "../../../../../../components/app/workspaces/WorkspaceContainer";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
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
  const renderForm = React.useCallback(
    (folder: IFolder) => {
      return (
        <WorkspaceContainer
          workspaceId={workspaceId}
          render={(workspace) => (
            <FileForm
              workspaceRootname={workspace.rootname}
              workspaceId={workspaceId}
              folderId={folderId}
              folderpath={folder.namePath.join(folderConstants.nameSeparator)}
              key="file-form"
            />
          )}
        />
      );
    },
    [folderId, workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderContainer
        folderId={folderId}
        render={renderForm}
        fetchConfig={swrConfig}
      />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(CreateFileInFolderParentFormPage);
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
