"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { Collaborator } from "fimidara";
import Link from "next/link";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import CollaboratorListContainer from "./CollaboratorListContainer";

export interface IWorkspaceCollaboratorsProps {
  workspaceId: string;
  renderItem?: (item: Collaborator) => React.ReactNode;
  renderList?: (items: Collaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceCollaborators: React.FC<IWorkspaceCollaboratorsProps> = (
  props
) => {
  const { workspaceId, menu } = props;

  return (
    <div className="space-y-8">
      <ListHeader
        label="Collaborators"
        buttons={
          <div className="flex items-center space-x-2">
            <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"user"}
            />
            {menu}
          </div>
        }
      />
      <CollaboratorListContainer {...props} />
    </div>
  );
};

export default WorkspaceCollaborators;
