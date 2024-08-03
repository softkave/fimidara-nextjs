"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { AgentToken } from "fimidara";
import Link from "next/link";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import AgentTokenListContainer from "./AgentTokenListContainer";

export interface IWorkspaceAgentTokensProps {
  workspaceId: string;
  renderItem?: (item: AgentToken) => React.ReactNode;
  renderList?: (items: AgentToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceAgentTokens: React.FC<IWorkspaceAgentTokensProps> = (props) => {
  const { workspaceId, menu } = props;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Agent Tokens"
        buttons={
          <div className="flex align-center space-x-2">
            <Link href={appWorkspacePaths.createAgentTokenForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"agentToken"}
            />
            {menu}
          </div>
        }
      />
      <AgentTokenListContainer {...props} />
    </Space>
  );
};

export default WorkspaceAgentTokens;
