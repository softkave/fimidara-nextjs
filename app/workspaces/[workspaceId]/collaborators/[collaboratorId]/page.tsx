"use client";

import CollaboratorComponent from "@/components/app/workspaces/collaborators/CollaboratorComponent";
import React, { use } from "react";

export type IWorkspaceCollaboratorPageProps = {
  params: Promise<{ workspaceId: string; collaboratorId: string }>;
};

const WorkspaceCollaboratorPage: React.FC<IWorkspaceCollaboratorPageProps> = (
  props
) => {
  const { collaboratorId, workspaceId } = use(props.params);
  return (
    <CollaboratorComponent
      collaboratorId={collaboratorId}
      workspaceId={workspaceId}
    />
  );
};

export default WorkspaceCollaboratorPage;
