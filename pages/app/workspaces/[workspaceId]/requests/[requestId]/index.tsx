import { GetServerSideProps } from "next";
import React from "react";
import WorkspaceRequest from "../../../../../../components/app/workspaces/requests/WorkspaceRequest";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IWorkspaceRequestPageProps = {
  workspaceId: string;
  requestId: string;
};

const WorkspaceRequestPage: React.FC<IWorkspaceRequestPageProps> = (props) => {
  const { workspaceId, requestId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.requestList(workspaceId)}
    >
      <WorkspaceRequest requestId={requestId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceRequestPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceRequestPageProps,
  IWorkspaceRequestPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      requestId: context.params!.requestId,
    },
  };
};
