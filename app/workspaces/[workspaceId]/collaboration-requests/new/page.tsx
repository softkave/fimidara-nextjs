"use client";

import RequestForm from "@/components/app/workspaces/requests/RequestForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

const WorkspaceCreateRequestFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => <RequestForm workspaceId={workspaceId} />,
  });
};

export default WorkspaceCreateRequestFormPage;
