"use client";

import WorkspaceAgentTokens from "@/components/app/workspaces/agentTokens/WorkspaceAgentTokens";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import React from "react";

export interface IWorkspaceAgentTokensPageProps
  extends IWorkspaceComponentProps {}

const WorkspaceAgentTokensPage: React.FC<IWorkspaceAgentTokensPageProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return <WorkspaceAgentTokens workspaceId={workspaceId} />;
};

export default WorkspaceAgentTokensPage;
