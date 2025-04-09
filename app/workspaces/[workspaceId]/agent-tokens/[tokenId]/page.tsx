"use client";

import AgentTokenComponent from "@/components/app/workspaces/agentTokens/AgentTokenComponent";
import AgentTokenContainer from "@/components/app/workspaces/agentTokens/AgentTokenContainer.tsx";
import React, { use } from "react";

export type IWorkspaceAgentTokenPageProps = {
  params: Promise<{ tokenId: string }>;
};

const WorkspaceAgentTokenPage: React.FC<IWorkspaceAgentTokenPageProps> = (
  props
) => {
  const { tokenId } = use(props.params);
  return (
    <AgentTokenContainer
      tokenId={tokenId}
      render={(token) => <AgentTokenComponent token={token} />}
    />
  );
};

export default WorkspaceAgentTokenPage;
