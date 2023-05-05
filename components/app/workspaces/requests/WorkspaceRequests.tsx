import { appWorkspacePaths } from "@/lib/definitions/system";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Link from "next/link";
import React from "react";
import { useWorkspaceCollaborationRequestsFetchHook } from "../../../../lib/hooks/fetchHooks";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import IconButton from "../../../utils/buttons/IconButton";
import ListHeader from "../../../utils/list/ListHeader";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import { appClasses } from "../../../utils/theme";
import WorkspaceRequestList from "./WorkspaceRequestList";

export interface IWorkspaceRequestsProps {
  workspaceId: string;
}

const WorkspaceRequests: React.FC<IWorkspaceRequestsProps> = (props) => {
  const { workspaceId } = props;
  const pagination = usePagination();
  const data = useWorkspaceCollaborationRequestsFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const error = data.store.error;
  const isLoading = data.store.loading || !data.store.initialized;
  const { count, resourceList } = data.store.get({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching collaboration requests."
        }
      />
    );
  } else if (isLoading) {
    content = <PageLoading messageText="Loading collaboration requests..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborations requests yet. Create one using the plus button above."
      />
    );
  } else {
    content = (
      <WorkspaceRequestList workspaceId={workspaceId} requests={resourceList} />
    );
  }

  return (
    <div className={appClasses.main}>
      <PaginatedContent
        header={
          <ListHeader
            label="Collaboration Requests"
            buttons={
              <Space>
                <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
                  <IconButton icon={<PlusOutlined />} />
                </Link>
              </Space>
            }
          />
        }
        pagination={count ? { ...pagination, count } : undefined}
        content={content}
      />
    </div>
  );
};

export default WorkspaceRequests;
