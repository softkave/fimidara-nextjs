"use client";

import { useCollaborationRequestForm } from "@/components/hooks/useCollaborationRequestForm.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { Collaborator } from "fimidara";
import { Plus } from "lucide-react";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import CollaboratorListContainer from "./CollaboratorListContainer";

export interface IWorkspaceCollaboratorsProps {
  workspaceId: string;
  renderItem?: (item: Collaborator) => React.ReactNode;
  renderList?: (items: Collaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const WorkspaceCollaborators: React.FC<IWorkspaceCollaboratorsProps> = (
  props
) => {
  const { workspaceId } = props;

  const formHook = useCollaborationRequestForm({ workspaceId });

  return (
    <div className="space-y-8">
      <ListHeader
        label="Collaborators"
        buttons={
          <div className="flex items-center space-x-2">
            <IconButton
              icon={<Plus className="h-4 w-4" />}
              onClick={() => formHook.setFormOpen(true)}
            />
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"user"}
            />
          </div>
        }
      />
      <CollaboratorListContainer {...props} />
      {formHook.node}
    </div>
  );
};

export default WorkspaceCollaborators;
