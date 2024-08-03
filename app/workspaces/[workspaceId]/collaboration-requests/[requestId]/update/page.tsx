"use client";

import RequestForm from "@/components/app/workspaces/requests/RequestForm";
import WorkspaceRequestContainer from "@/components/app/workspaces/requests/WorkspaceRequestContainer.tsx";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspaceRequestFormPageProps = {
  params: { workspaceId: string; requestId: string };
};

const WorkspaceRequestFormPage: React.FC<IWorkspaceRequestFormPageProps> = (
  props
) => {
  const { workspaceId, requestId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceRequestContainer
        requestId={requestId}
        render={(request) => (
          <RequestForm workspaceId={request.workspaceId} request={request} />
        )}
      />
    ),
  });
};

export default WorkspaceRequestFormPage;
