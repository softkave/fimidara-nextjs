import { GetServerSideProps } from "next";
import React from "react";
import ClientToken from "../../../../../../components/app/workspaces/clientTokens/ClientToken";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IWorkspaceClientTokenPageProps = {
  workspaceId: string;
  tokenId: string;
};

const WorkspaceClientTokenPage: React.FC<IWorkspaceClientTokenPageProps> = (
  props
) => {
  const { workspaceId, tokenId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.clientTokenList(workspaceId)}
    >
      <ClientToken tokenId={tokenId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceClientTokenPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceClientTokenPageProps,
  IWorkspaceClientTokenPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      tokenId: context.params!.tokenId,
    },
  };
};
