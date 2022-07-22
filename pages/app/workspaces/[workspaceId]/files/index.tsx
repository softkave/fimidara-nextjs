import React from "react";
import FileListContainer from "../../../../../components/app/workspaces/files/FileListContainer";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";
import { IWorkspace } from "../../../../../lib/definitions/workspace";

export interface IWorkspaceFilesPageProps {
  workspaceId: string;
}

const WorkspaceFilePage: React.FC<IWorkspaceFilesPageProps> = (props) => {
  const { workspaceId } = props;
  const renderFileList = React.useCallback(
    (workspace: IWorkspace) => {
      return (
        <FileListContainer
          workspaceId={workspaceId}
          workspaceRootname={workspace.rootname}
        />
      );
    },
    [workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      render={renderFileList}
    />
  );
};

export default withPageAuthRequired(WorkspaceFilePage);
export const getServerSideProps = getWorkspaceServerSideProps;
