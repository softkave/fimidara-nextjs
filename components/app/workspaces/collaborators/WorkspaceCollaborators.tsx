import ListHeader from "@/components/utils/list/ListHeader";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Collaborator } from "fimidara";
import Link from "next/link";
import React from "react";
import IconButton from "../../../utils/buttons/IconButton";
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
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Collaborators"
        buttons={
          <Space>
            <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"user"}
            />
            {menu}
          </Space>
        }
      />
      <CollaboratorListContainer {...props} />
    </Space>
  );
};

export default WorkspaceCollaborators;
