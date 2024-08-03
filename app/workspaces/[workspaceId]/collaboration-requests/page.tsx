"use client";

import WorkspaceRequests from "@/components/app/workspaces/requests/WorkspaceRequests";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils.ts";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const WorkspaceRequestsPage: React.FC<IWorkspaceComponentProps> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => <WorkspaceRequests workspaceId={workspaceId} />,
  });
};

export default WorkspaceRequestsPage;
