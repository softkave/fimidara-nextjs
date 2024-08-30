"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
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
    <div className="space-y-8">
      <ListHeader
        label="Agent Tokens"
        buttons={
          <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default WorkspaceAgentTokens;
