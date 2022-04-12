import { GetServerSideProps } from "next";
import React from "react";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import WorkspaceRequest from "../../../../../../components/app/workspaces/requests/WorkspaceRequest";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
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

export default withPageAuthRequired(WorkspaceRequestPage);

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
