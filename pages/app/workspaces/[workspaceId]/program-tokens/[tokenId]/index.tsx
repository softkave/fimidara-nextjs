import { GetServerSideProps } from "next";
import React from "react";
import ProgramToken from "../../../../../../components/app/workspaces/programTokens/ProgramToken";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IWorkspaceProgramTokenPageProps = {
  workspaceId: string;
  tokenId: string;
};

const WorkspaceProgramTokenPage: React.FC<IWorkspaceProgramTokenPageProps> = (
  props
) => {
  const { workspaceId, tokenId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.programTokenList(workspaceId)}
    >
      <ProgramToken tokenId={tokenId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceProgramTokenPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceProgramTokenPageProps,
  IWorkspaceProgramTokenPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      tokenId: context.params!.tokenId,
    },
  };
};
