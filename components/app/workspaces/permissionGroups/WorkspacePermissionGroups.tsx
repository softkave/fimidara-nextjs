"use client";

import { usePermissionGroupForm } from "@/components/hooks/usePermissionGroupForm.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { PermissionGroup } from "fimidara";
import { Plus } from "lucide-react";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import PermissionGroupListContainer from "./PermissionGroupListContainer";

export interface IWorkspacePermissionGroupsProps {
  workspaceId: string;
  renderItem?: (item: PermissionGroup) => React.ReactNode;
  renderList?: (items: PermissionGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const WorkspacePermissionGroups: React.FC<IWorkspacePermissionGroupsProps> = (
  props
) => {
  const { workspaceId } = props;

  const formHook = usePermissionGroupForm({ workspaceId });

  return (
    <div>
      <div className="space-y-4">
        <ListHeader
          label="Permission Groups"
          buttons={
            <div className="flex items-center space-x-2">
              <IconButton
                icon={<Plus className="h-4 w-4" />}
                onClick={() => formHook.setFormOpen(true)}
              />
              <WorkspaceResourceListMenu
                workspaceId={workspaceId}
                targetType="permissionGroup"
              />
            </div>
          }
        />
        <PermissionGroupListContainer {...props} />
      </div>
      {formHook.node}
    </div>
  );
};

export default WorkspacePermissionGroups;
