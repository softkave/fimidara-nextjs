import AgentTokenForm from "@/components/app/workspaces/agentTokens/AgentTokenForm";
import {
  IWorkspaceComponentProps,
  getWorkspaceServerSideProps,
} from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

const WorkspaceCreateAgentTokenFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;
  return <AgentTokenForm workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceCreateAgentTokenFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
