import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import assert from "assert";
import { useRouter } from "next/router";
import React from "react";
import { useWorkspaceAgentTokenFetchHook } from "../../../../lib/hooks/fetchHooks";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import AgentTokenMenu from "./AgentTokenMenu";

export interface IAgentTokenProps {
  tokenId: string;
}

/**
 * TODO: add created/last updated date and who, same for other pages
 */

function AgentToken(props: IAgentTokenProps) {
  const { tokenId } = props;
  const router = useRouter();
  const data = useWorkspaceAgentTokenFetchHook({ tokenId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  const onCompeleteDeleteToken = React.useCallback(async () => {
    assert(resource, new Error("Agent token not found."));
    router.push(
      data
        ? appWorkspacePaths.agentTokenList(resource.workspaceId)
        : appWorkspacePaths.workspaces
    );
  }, [data, router]);

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching agent assigned token."
        }
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading agent assigned token..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Agent token not found." />;
  }

  const expirationDate = resource.expires && formatDateTime(resource.expires);

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader copyable title={resource.resourceId}>
          <AgentTokenMenu
            token={resource}
            onCompleteDelete={onCompeleteDeleteToken}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={resource.resourceId}
        />
        {resource.providedResourceId && (
          <LabeledNode
            nodeIsText
            copyable
            direction="vertical"
            label="Provided Resource ID"
            node={resource.providedResourceId}
          />
        )}
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Token"
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
      </Space>
    </div>
  );
}

export default AgentToken;
