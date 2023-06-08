import WorkspaceAgentTokens from "@/components/app/workspaces/agentTokens/WorkspaceAgentTokens";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceAgentTokensPageProps {
  workspaceId: string;
}

const WorkspaceAgentTokensPage: React.FC<IWorkspaceAgentTokensPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return <WorkspaceAgentTokens workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceAgentTokensPage);
export const getServerSideProps = getWorkspaceServerSideProps;
