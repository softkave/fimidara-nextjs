import FileListContainer from "@/components/app/workspaces/files/FileListContainer old";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IRootLevelFilesPageProps {
  workspaceId: string;
}

const RootLevelFilesPage: React.FC<IRootLevelFilesPageProps> = (props) => {
  const { workspaceId } = props;
  return <FileListContainer workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(RootLevelFilesPage);
export const getServerSideProps = getWorkspaceServerSideProps;
