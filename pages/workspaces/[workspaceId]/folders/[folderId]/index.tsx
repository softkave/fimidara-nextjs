import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderComponent from "@/components/app/workspaces/files/FolderComponent";
import FolderContainer from "@/components/app/workspaces/files/FolderContainer";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IFolderPageProps = {
  workspaceId: string;
  folderId: string;
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { workspaceId, folderId } = props;

  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <FolderContainer
          folderId={folderId}
          render={(folder) => {
            return (
              <FolderComponent
                folder={folder}
                workspaceRootname={workspace.rootname}
              />
            );
          }}
        />
      )}
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
