"use client";

import WorkspaceCollaborators from "@/components/app/workspaces/collaborators/WorkspaceCollaborators";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import React, { use } from "react";

const WorkspaceCollaboratorsPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = use(props.params);
  return <WorkspaceCollaborators workspaceId={workspaceId} />;
};

export default WorkspaceCollaboratorsPage;
