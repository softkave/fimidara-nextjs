import AgentToken from "@/components/app/workspaces/agentTokens/AgentToken";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspaceAgentTokenPageProps = {
  tokenId: string;
};

const WorkspaceAgentTokenPage: React.FC<IWorkspaceAgentTokenPageProps> = (
  props
) => {
  const { tokenId } = props;
  return <AgentToken tokenId={tokenId} />;
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
