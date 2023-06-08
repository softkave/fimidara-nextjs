import WorkspaceRequests from "@/components/app/workspaces/requests/WorkspaceRequests";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceRequestsPageProps {
  workspaceId: string;
}

const WorkspaceRequestsPage: React.FC<IWorkspaceRequestsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return <WorkspaceRequests workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceRequestsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
