import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FileContainer from "@/components/app/workspaces/files/FileContainer";
import FileForm from "@/components/app/workspaces/files/FileForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IUpdateFileFormPageProps = {
  workspaceId: string;
  fileId: string;
};

const UpdateFileFormPage: React.FC<IUpdateFileFormPageProps> = (props) => {
  const { workspaceId, fileId } = props;

  return (
    <FileContainer
      fileId={fileId}
      workspaceId={workspaceId}
      render={(file) => {
        return (
          <WorkspaceContainer
            workspaceId={workspaceId}
            render={(workspace) => (
              <FileForm
                workspaceId={workspaceId}
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

export default withPageAuthRequiredHOC(UpdateFileFormPage);
export const getServerSideProps: GetServerSideProps<
  IUpdateFileFormPageProps,
  IUpdateFileFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      fileId: context.params!.fileId,
    },
  };
};
