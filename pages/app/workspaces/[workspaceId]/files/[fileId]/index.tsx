import { GetServerSideProps } from "next";
import React from "react";
import FileComponent from "../../../../../../components/app/workspaces/files/FileComponent";
import FileContainer from "../../../../../../components/app/workspaces/files/FileContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFile } from "../../../../../../lib/definitions/file";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IFilePageProps = {
  workspaceId: string;
  fileId: string;
};

const FilePage: React.FC<IFilePageProps> = (props) => {
  const { workspaceId, fileId } = props;
  const renderFile = React.useCallback((file: IFile) => {
    return <FileComponent file={file} />;
  }, []);

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FileContainer
        fileId={fileId}
        workspaceId={workspaceId}
        render={renderFile}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(FilePage);

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
