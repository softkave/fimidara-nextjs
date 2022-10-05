import React from "react";
import WorkspaceClientTokens from "../../../../../components/app/workspaces/clientTokens/WorkspaceClientTokens";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspaceClientTokensPageProps {
  workspaceId: string;
}

const WorkspaceClientTokensPage: React.FC<IWorkspaceClientTokensPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.clientTokenList(workspaceId)}
    >
      <WorkspaceClientTokens workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceClientTokensPage);
export const getServerSideProps = getWorkspaceServerSideProps;
