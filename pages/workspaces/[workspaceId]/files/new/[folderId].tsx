import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileForm from "@/components/app/workspaces/files/FileForm";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { folderConstants } from "@/lib/definitions/folder";
import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";

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

  return (
    <FolderContainer
      folderId={folderId}
      render={(folder) => {
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
      }}
      fetchConfig={swrConfig}
    />
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
