"use client";

import AgentTokenContainer from "@/components/app/workspaces/agentTokens/AgentTokenContainer.tsx";
import AgentTokenForm from "@/components/app/workspaces/agentTokens/AgentTokenForm";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspaceAgentTokenFormPageProps = {
  params: { tokenId: string };
};

const WorkspaceAgentTokenFormPage: React.FC<
  IWorkspaceAgentTokenFormPageProps
> = (props) => {
  const { tokenId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <AgentTokenContainer
        tokenId={tokenId}
        render={(token) => (
          <AgentTokenForm workspaceId={token.workspaceId} agentToken={token} />
        )}
      />
    ),
  });
};

export default WorkspaceAgentTokenFormPage;
