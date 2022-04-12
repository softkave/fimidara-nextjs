import React from "react";
import FileListContainer from "../../../../../components/app/workspaces/files/FileListContainer";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IRootLevelFilesPageProps {
  workspaceId: string;
}

const RootLevelFilesPage: React.FC<IRootLevelFilesPageProps> = (props) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FileListContainer workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(RootLevelFilesPage);
export const getServerSideProps = getWorkspaceServerSideProps;
