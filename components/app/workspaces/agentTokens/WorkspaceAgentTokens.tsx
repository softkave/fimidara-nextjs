"use client";

import { useAgentTokenForm } from "@/components/hooks/useAgentTokenForm.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import { AgentToken } from "fimidara";
import { Plus } from "lucide-react";
import { FC, ReactElement, ReactNode } from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import AgentTokenListContainer from "./AgentTokenListContainer";

export interface IWorkspaceAgentTokensProps {
  workspaceId: string;
  renderItem?: (item: AgentToken) => ReactNode;
  renderList?: (items: AgentToken[]) => ReactNode;
  renderRoot?: (node: ReactNode) => ReactElement;
  menu?: ReactNode;
}

const WorkspaceAgentTokens: FC<IWorkspaceAgentTokensProps> = (props) => {
  const { workspaceId, menu } = props;
  const formHook = useAgentTokenForm({ workspaceId });

  return (
    <div className="space-y-4">
      <ListHeader
        label="Agent Tokens"
        buttons={
          <div className="flex items-center space-x-2">
            <IconButton
              icon={<Plus className="h-4 w-4" />}
              onClick={() => formHook.setFormOpen(true)}
            />
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"agentToken"}
            />
            {menu}
          </div>
        }
      />
      <AgentTokenListContainer {...props} />
      {formHook.node}
    </div>
  );
};

export default WorkspaceAgentTokens;
