import { GetServerSideProps } from "next";
import React from "react";
import ClientTokenForm from "../../../../../../components/app/workspaces/clientTokens/ClientTokenForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import useClientToken from "../../../../../../lib/hooks/workspaces/useClientToken";
import { getBaseError } from "../../../../../../lib/utils/errors";

export type IWorkspaceClientTokenFormPageProps = {
  workspaceId: string;
  tokenId: string;
};

const WorkspaceClientTokenFormPage: React.FC<
  IWorkspaceClientTokenFormPageProps
> = (props) => {
  const { workspaceId, tokenId } = props;
  const { error, isLoading, data } = useClientToken(tokenId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching client assigned token"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading client assigned token..." />;
  } else {
    content = (
      <ClientTokenForm
        workspaceId={data.token.workspaceId}
        clientToken={data.token}
      />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.clientTokenList(workspaceId)}
    >
      {content}
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceClientTokenFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceClientTokenFormPageProps,
  IWorkspaceClientTokenFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      tokenId: context.params!.tokenId,
    },
  };
};
