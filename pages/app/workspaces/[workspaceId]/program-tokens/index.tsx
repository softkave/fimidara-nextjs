import React from "react";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import WorkspaceProgramTokens from "../../../../../components/app/workspaces/programTokens/WorkspaceProgramTokens";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspaceProgramTokensPageProps {
  workspaceId: string;
}

const WorkspaceProgramTokensPage: React.FC<IWorkspaceProgramTokensPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.programTokenList(workspaceId)}
    >
      <WorkspaceProgramTokens workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspaceProgramTokensPage);
export const getServerSideProps = getWorkspaceServerSideProps;