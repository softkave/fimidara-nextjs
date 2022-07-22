import { GetServerSideProps } from "next";
import React from "react";
import FileComponent from "../../../../../../components/app/workspaces/files/FileComponent";
import FileContainer from "../../../../../../components/app/workspaces/files/FileContainer";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import { IWorkspace } from "../../../../../../lib/definitions/workspace";

export type IFilePageProps = {
  workspaceId: string;
  fileId: string;
};

const FilePage: React.FC<IFilePageProps> = (props) => {
  const { workspaceId, fileId } = props;
  const renderFileContainer = React.useCallback(
    (workspace: IWorkspace) => {
      return (
        <FileContainer
          fileId={fileId}
          workspaceId={workspaceId}
          render={(file) => (
            <FileComponent file={file} workspaceRootname={workspace.rootname} />
          )}
        />
      );
    },
    [fileId, workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      render={renderFileContainer}
    />
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
