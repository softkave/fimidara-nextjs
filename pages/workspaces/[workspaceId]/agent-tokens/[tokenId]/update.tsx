import AgentTokenForm from "@/components/app/workspaces/agentTokens/AgentTokenForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import useAgentToken from "@/lib/hooks/workspaces/useAgentToken";
import { getBaseError } from "@/lib/utils/errors";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspaceAgentTokenFormPageProps = {
  tokenId: string;
};

const WorkspaceAgentTokenFormPage: React.FC<
  IWorkspaceAgentTokenFormPageProps
> = (props) => {
  const { tokenId } = props;
  const { error, isLoading, data } = useAgentToken(tokenId);

  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching agent token."}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading agent token..." />;
  } else {
    return (
      <AgentTokenForm
        workspaceId={data.token.workspaceId}
        agentToken={data.token}
      />
    );
  }
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
