"use client";

import WorkspaceRequest from "@/components/app/workspaces/requests/WorkspaceRequest";
import WorkspaceRequestContainer from "@/components/app/workspaces/requests/WorkspaceRequestContainer.tsx";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspaceRequestPageProps = {
  params: { workspaceId: string; requestId: string };
};

const WorkspaceRequestPage: React.FC<IWorkspaceRequestPageProps> = (props) => {
  const { workspaceId, requestId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceRequestContainer
        requestId={requestId}
        render={(request) => <WorkspaceRequest request={request} />}
      />
    ),
  });
};

export default WorkspaceRequestPage;
