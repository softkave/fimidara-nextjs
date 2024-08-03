"use client";

import AgentTokenForm from "@/components/app/workspaces/agentTokens/AgentTokenForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const WorkspaceCreateAgentTokenFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => <AgentTokenForm workspaceId={workspaceId} />,
  });
};

export default WorkspaceCreateAgentTokenFormPage;
