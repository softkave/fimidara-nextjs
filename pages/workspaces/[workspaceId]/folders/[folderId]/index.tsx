import FileListContainer from "@/components/app/workspaces/files/FileListContainer old";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IFolderFilesPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderFilesPage: React.FC<IFolderFilesPageProps> = (props) => {
  const { workspaceId, folderId } = props;

  return (
    <FolderContainer
      folderId={folderId}
      render={(folder) => {
        return <FileListContainer workspaceId={workspaceId} folder={folder} />;
      }}
    />
  );
};

export default withPageAuthRequiredHOC(FolderFilesPage);

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
