"use client";

import AgentTokenComponent from "@/components/app/workspaces/agentTokens/AgentTokenComponent";
import AgentTokenContainer from "@/components/app/workspaces/agentTokens/AgentTokenContainer.tsx";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspaceAgentTokenPageProps = {
  params: { tokenId: string };
};

const WorkspaceAgentTokenPage: React.FC<IWorkspaceAgentTokenPageProps> = (
  props
) => {
  const { tokenId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <AgentTokenContainer
        tokenId={tokenId}
        render={(token) => <AgentTokenComponent token={token} />}
      />
    ),
  });
};

export default WorkspaceAgentTokenPage;
