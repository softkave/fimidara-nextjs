import React from "react";
import WorkspaceRequests from "../../../../../components/app/workspaces/requests/WorkspaceRequests";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspaceRequestsPageProps {
  workspaceId: string;
}

const WorkspaceRequestsPage: React.FC<IWorkspaceRequestsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.requestList(workspaceId)}
    >
      <WorkspaceRequests workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceRequestsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
