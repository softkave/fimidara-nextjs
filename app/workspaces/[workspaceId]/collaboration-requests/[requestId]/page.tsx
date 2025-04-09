"use client";

import WorkspaceRequest from "@/components/app/workspaces/requests/WorkspaceRequest";
import WorkspaceRequestContainer from "@/components/app/workspaces/requests/WorkspaceRequestContainer.tsx";
import React, { use } from "react";

export type IWorkspaceRequestPageProps = {
  params: Promise<{ workspaceId: string; requestId: string }>;
};

const WorkspaceRequestPage: React.FC<IWorkspaceRequestPageProps> = (props) => {
  const { requestId } = use(props.params);
  return (
    <WorkspaceRequestContainer
      requestId={requestId}
      render={(request) => <WorkspaceRequest request={request} />}
    />
  );
};

export default WorkspaceRequestPage;
