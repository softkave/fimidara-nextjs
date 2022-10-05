import { GetServerSideProps } from "next";
import React from "react";
import RequestForm from "../../../../../../components/app/workspaces/requests/RequestForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import useCollaborationRequest from "../../../../../../lib/hooks/requests/useRequest";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IWorkspaceRequestFormPageProps = {
  workspaceId: string;
  requestId: string;
};

const WorkspaceRequestFormPage: React.FC<IWorkspaceRequestFormPageProps> = (
  props
) => {
  const { workspaceId, requestId } = props;
  const { error, isLoading, data } = useCollaborationRequest(requestId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaboration request..." />;
  } else {
    content = (
      <RequestForm
        workspaceId={data.request.workspaceId}
        request={data.request}
      />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.requestList(workspaceId)}
    >
      {content}
    </Workspace>
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
