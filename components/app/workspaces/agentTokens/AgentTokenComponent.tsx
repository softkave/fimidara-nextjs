import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { kAppWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { AgentToken } from "fimidara";
import { useRouter } from "next/navigation";
import React from "react";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import AgentTokenMenu from "./AgentTokenMenu";

export interface IAgentTokenProps {
  token: AgentToken;
}

/**
 * TODO: add created/last updated date and who, same for other pages
 */

function AgentTokenComponent(props: IAgentTokenProps) {
  const { token: resource } = props;
  const router = useRouter();
  const onCompeleteDeleteToken = React.useCallback(async () => {
    router.push(
      resource
        ? kAppWorkspacePaths.agentTokenList(resource.workspaceId)
        : kAppWorkspacePaths.workspaces
    );
  }, [router, resource]);

  const expirationDate =
    resource.expiresAt && formatDateTime(resource.expiresAt);

  return (
    <div>
      <div className="space-x-8">
        <ComponentHeader title={resource.name || resource.resourceId}>
          <AgentTokenMenu
            token={resource}
            onCompleteDelete={onCompeleteDeleteToken}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          code
          direction="vertical"
          label="Resource ID"
          node={resource.resourceId}
        />
        {resource.providedResourceId && (
          <LabeledNode
            nodeIsText
            copyable
            code
            direction="vertical"
            label="Provided Resource ID"
            node={resource.providedResourceId}
          />
        )}
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="JWT Token"
          node={resource.tokenStr}
        />
        {expirationDate && (
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Token Expires"
            node={expirationDate}
          />
        )}
        <LabeledNode
          nodeIsText
          direction="vertical"
          label="Last Updated"
          node={formatDateTime(resource.lastUpdatedAt)}
        />
        {resource.description && (
          <LabeledNode
            direction="vertical"
            label="Description"
            node={<p className="line-clamp-2">{resource.description}</p>}
          />
        )}
        <AssignedPermissionGroupList
          entityId={resource.resourceId}
          workspaceId={resource.workspaceId}
        />
      </div>
    </div>
  );
}

export default AgentTokenComponent;
