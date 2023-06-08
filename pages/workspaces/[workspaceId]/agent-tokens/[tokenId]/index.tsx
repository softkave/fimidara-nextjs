import AgentTokenComponent from "@/components/app/workspaces/agentTokens/AgentTokenComponent";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";
import AgentTokenContainer from "../../../../../components/app/workspaces/agentTokens/AgentTokenContainer";

export type IWorkspaceAgentTokenPageProps = {
  tokenId: string;
};

const WorkspaceAgentTokenPage: React.FC<IWorkspaceAgentTokenPageProps> = (
  props
) => {
  const { tokenId } = props;
  return (
    <AgentTokenContainer
      tokenId={tokenId}
      render={(token) => <AgentTokenComponent token={token} />}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceAgentTokenPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceAgentTokenPageProps,
  IWorkspaceAgentTokenPageProps
> = async (context) => {
  return {
    props: { tokenId: context.params!.tokenId },
  };
};
