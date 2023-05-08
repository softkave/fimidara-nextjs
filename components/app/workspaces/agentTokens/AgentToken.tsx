import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useFetchSingleResourceFetchState } from "../../../../lib/hooks/fetchHookUtils";
import { useWorkspaceAgentTokenFetchHook } from "../../../../lib/hooks/singleResourceFetchHooks";
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
  const { fetchState } = useWorkspaceAgentTokenFetchHook({ tokenId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  const onCompeleteDeleteToken = React.useCallback(async () => {
    router.push(
      resource
        ? appWorkspacePaths.agentTokenList(resource.workspaceId)
        : appWorkspacePaths.workspaces
    );
  }, [router]);

  if (resource) {
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
  } else if (error) {
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
}

export default AgentToken;
