import RequestForm from "@/components/app/workspaces/requests/RequestForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";
import WorkspaceRequestContainer from "../../../../../components/app/workspaces/requests/WorkspaceRequestContainer";

export type IWorkspaceRequestFormPageProps = {
  workspaceId: string;
  requestId: string;
};

const WorkspaceRequestFormPage: React.FC<IWorkspaceRequestFormPageProps> = (
  props
) => {
  const { workspaceId, requestId } = props;
  return (
    <WorkspaceRequestContainer
      requestId={requestId}
      render={(request) => (
        <RequestForm workspaceId={request.workspaceId} request={request} />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceRequestFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceRequestFormPageProps,
  IWorkspaceRequestFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      requestId: context.params!.requestId,
    },
  };
};
