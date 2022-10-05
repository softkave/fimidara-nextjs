import React from "react";
import RequestForm from "../../../../../components/app/workspaces/requests/RequestForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const WorkspaceCreateRequestFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.requestList(workspaceId)}
    >
      <RequestForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceCreateRequestFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
