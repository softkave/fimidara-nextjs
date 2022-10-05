import { GetServerSideProps } from "next";
import React from "react";
import ProgramTokenForm from "../../../../../../components/app/workspaces/programTokens/ProgramTokenForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import useProgramToken from "../../../../../../lib/hooks/workspaces/useProgramToken";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IWorkspaceProgramTokenFormPageProps = {
  workspaceId: string;
  tokenId: string;
};

const WorkspaceProgramTokenFormPage: React.FC<
  IWorkspaceProgramTokenFormPageProps
> = (props) => {
  const { workspaceId, tokenId } = props;
  const { error, isLoading, data } = useProgramToken(tokenId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching program access token"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading program access token..." />;
  } else {
    content = (
      <ProgramTokenForm
        workspaceId={data.token.workspaceId}
        programToken={data.token}
      />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.programTokenList(workspaceId)}
    >
      {content}
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceProgramTokenFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceProgramTokenFormPageProps,
  IWorkspaceProgramTokenFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      tokenId: context.params!.tokenId,
    },
  };
};
