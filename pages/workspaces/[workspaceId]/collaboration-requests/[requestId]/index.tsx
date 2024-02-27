import WorkspaceRequest from "@/components/app/workspaces/requests/WorkspaceRequest";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";
import WorkspaceRequestContainer from "../../../../../components/app/workspaces/requests/WorkspaceRequestContainer";

export type IWorkspaceRequestPageProps = {
  workspaceId: string;
  requestId: string;
};

const WorkspaceRequestPage: React.FC<IWorkspaceRequestPageProps> = (props) => {
  const { workspaceId, requestId } = props;
  return (
    <WorkspaceRequestContainer
      requestId={requestId}
      render={(request) => <WorkspaceRequest request={request} />}
    />
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
