import AgentTokenForm from "@/components/app/workspaces/agentTokens/AgentTokenForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";
import AgentTokenContainer from "../../../../../components/app/workspaces/agentTokens/AgentTokenContainer";

export type IWorkspaceAgentTokenFormPageProps = {
  tokenId: string;
};

const WorkspaceAgentTokenFormPage: React.FC<
  IWorkspaceAgentTokenFormPageProps
> = (props) => {
  const { tokenId } = props;
  return (
    <AgentTokenContainer
      tokenId={tokenId}
      render={(token) => (
        <AgentTokenForm workspaceId={token.workspaceId} agentToken={token} />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceAgentTokenFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceAgentTokenFormPageProps,
  IWorkspaceAgentTokenFormPageProps
> = async (context) => {
  return {
    props: { tokenId: context.params!.tokenId },
  };
};
