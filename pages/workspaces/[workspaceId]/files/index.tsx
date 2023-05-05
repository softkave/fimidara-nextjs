import FileListContainer from "@/components/app/workspaces/files/FileListContainer old";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceFilesPageProps {
  workspaceId: string;
}

const WorkspaceFilePage: React.FC<IWorkspaceFilesPageProps> = (props) => {
  const { workspaceId } = props;
  return <FileListContainer workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceFilePage);
export const getServerSideProps = getWorkspaceServerSideProps;
