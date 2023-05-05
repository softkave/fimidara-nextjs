import RequestForm from "@/components/app/workspaces/requests/RequestForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import useWorkspaceCollaborationRequest from "@/lib/hooks/requests/useWorkspaceCollaborationRequest";
import { getBaseError } from "@/lib/utils/errors";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspaceRequestFormPageProps = {
  workspaceId: string;
  requestId: string;
};

const WorkspaceRequestFormPage: React.FC<IWorkspaceRequestFormPageProps> = (
  props
) => {
  const { workspaceId, requestId } = props;
  const { error, isLoading, data } =
    useWorkspaceCollaborationRequest(requestId);
  let content: React.ReactNode = null;

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request."
        }
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading collaboration request..." />;
  } else {
    return (
      <RequestForm
        workspaceId={data.request.workspaceId}
        request={data.request}
      />
    );
  }
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
