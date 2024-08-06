import IconButton from "@/components/utils/buttons/IconButton";
import ListHeader from "@/components/utils/list/ListHeader";
import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaborationRequestsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Link from "next/link";
import React from "react";
import WorkspaceResourceListMenu from "../WorkspaceResourceListMenu";
import WorkspaceRequestList from "./WorkspaceRequestList";

export interface IWorkspaceRequestsProps {
  workspaceId: string;
}

const WorkspaceRequests: React.FC<IWorkspaceRequestsProps> = (props) => {
  const { workspaceId } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceCollaborationRequestsFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching permission groups"
      defaultLoadingMessage="Loading permission groups..."
      render={(data) => {
        if (data.length) {
          return (
            <WorkspaceRequestList
              workspaceId={workspaceId}
              requests={resourceList}
            />
          );
        } else {
          return (
            <PageNothingFound message="No collaborations requests yet. Create one using the plus button above" />
          );
        }
      }}
    />
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Collaboration Requests"
        buttons={
          <div className="flex items-center space-x-2">
            <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"collaborationRequest"}
            />
          </div>
        }
      />
      <PaginatedContent
        pagination={count ? { ...pagination, count } : undefined}
        content={contentNode}
      />
    </Space>
  );
};

export default WorkspaceRequests;
