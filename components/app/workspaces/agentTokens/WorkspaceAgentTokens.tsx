import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceAgentTokensFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { AgentToken } from "fimidara";
import Link from "next/link";
import React from "react";
import AgentTokenList from "./AgentTokenList";

export interface IWorkspaceAgentTokensProps {
  workspaceId: string;
  renderItem?: (item: AgentToken) => React.ReactNode;
  renderList?: (items: AgentToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceAgentTokens: React.FC<IWorkspaceAgentTokensProps> = (props) => {
  const { workspaceId, menu, renderList, renderRoot, renderItem } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceAgentTokensFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching agent tokens."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading agent tokens..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound
        message={
          "No agent tokens yet. " +
          "You can create one using the plus button above."
        }
      />
    );
  } else {
    content = renderList ? (
      renderList(resourceList)
    ) : (
      <AgentTokenList
        workspaceId={workspaceId}
        tokens={resourceList}
        renderItem={renderItem}
      />
    );
  }

  content = (
    <PaginatedContent content={content} pagination={{ ...pagination, count }} />
  );
  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Agent Tokens"
        buttons={
          <Space>
            <Link href={appWorkspacePaths.createAgentTokenForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            {menu}
          </Space>
        }
      />
      {content}
    </Space>
  );
};

export default WorkspaceAgentTokens;
