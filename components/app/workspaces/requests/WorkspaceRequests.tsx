import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaborationRequestsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Link from "next/link";
import React from "react";
import IconButton from "../../../utils/buttons/IconButton";
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
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={
          getBaseError(error) || "Error fetching collaboration requests."
        }
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading collaboration requests..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound message="No collaborations requests yet. Create one using the plus button above." />
    );
  } else {
    content = (
      <WorkspaceRequestList workspaceId={workspaceId} requests={resourceList} />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Collaboration Requests"
        buttons={
          <Space>
            <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            <WorkspaceResourceListMenu
              workspaceId={workspaceId}
              targetType={"collaborationRequest"}
            />
          </Space>
        }
      />
      <PaginatedContent
        pagination={count ? { ...pagination, count } : undefined}
        content={content}
      />
    </Space>
  );
};

export default WorkspaceRequests;
