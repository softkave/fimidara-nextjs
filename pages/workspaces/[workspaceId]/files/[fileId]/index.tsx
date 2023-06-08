import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileComponent from "@/components/app/workspaces/files/FileComponent";
import FileContainer from "@/components/app/workspaces/files/FileContainer";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IFilePageProps = {
  workspaceId: string;
  fileId: string;
};

const FilePage: React.FC<IFilePageProps> = (props) => {
  const { workspaceId, fileId } = props;

  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => {
        return (
          <FileContainer
            fileId={fileId}
            workspaceId={workspaceId}
            render={(file) => (
              <FileComponent
                file={file}
                workspaceRootname={workspace.rootname}
              />
            )}
          />
        );
      }}
    />
  );
};

export default withPageAuthRequiredHOC(FilePage);

export const getServerSideProps: GetServerSideProps<
  IFilePageProps,
  IFilePageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      fileId: context.params!.fileId,
    },
  };
};
