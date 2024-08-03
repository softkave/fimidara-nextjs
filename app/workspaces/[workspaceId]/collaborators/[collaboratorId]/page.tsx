"use client";

import CollaboratorComponent from "@/components/app/workspaces/collaborators/CollaboratorComponent";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import React from "react";

export type IWorkspaceCollaboratorPageProps = {
  params: { workspaceId: string; collaboratorId: string };
};

const WorkspaceCollaboratorPage: React.FC<IWorkspaceCollaboratorPageProps> = (
  props
) => {
  const { workspaceId, collaboratorId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <CollaboratorComponent
        collaboratorId={collaboratorId}
        workspaceId={workspaceId}
      />
    ),
  });
};

export default WorkspaceCollaboratorPage;
