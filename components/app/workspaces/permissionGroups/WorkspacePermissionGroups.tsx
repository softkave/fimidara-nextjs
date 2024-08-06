"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { PermissionGroup } from "fimidara";
import Link from "next/link";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import PermissionGroupListContainer from "./PermissionGroupListContainer";

export interface IWorkspacePermissionGroupsProps {
  workspaceId: string;
  renderItem?: (item: PermissionGroup) => React.ReactNode;
  renderList?: (items: PermissionGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspacePermissionGroups: React.FC<IWorkspacePermissionGroupsProps> = (
  props
) => {
  const { workspaceId, menu } = props;

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          label="Permission Groups"
          buttons={
            <div className="flex items-center space-x-2">
              <Link
                href={appWorkspacePaths.createPermissionGroupForm(workspaceId)}
              >
                <IconButton icon={<PlusOutlined />} />
              </Link>
              <WorkspaceResourceListMenu
                workspaceId={workspaceId}
                targetType="permissionGroup"
              />
              {menu}
            </div>
          }
        />
        <PermissionGroupListContainer {...props} />
      </Space>
    </div>
  );
};

export default WorkspacePermissionGroups;
