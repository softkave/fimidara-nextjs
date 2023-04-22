import { Space } from "antd";
import React from "react";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import usePagination from "../../../../lib/hooks/usePagination";
import useWorkspaceRequestList from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { getBaseError } from "../../../../lib/utils/errors";
import ListHeader from "../../../utils/ListHeader";
import { PaginatedContent } from "../../../utils/page/PaginatedContent";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import WorkspaceRequestList from "./WorkspaceRequestList";

export interface IWorkspaceRequestsContainerProps {
  workspaceId: string;
}

const WorkspaceRequestsContainer: React.FC<IWorkspaceRequestsContainerProps> = (
  props
) => {
  const { workspaceId } = props;
  const pagination = usePagination();
  const { data, error, isLoading } = useWorkspaceRequestList({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;
  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching collaboration requests"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaboration requests..." />;
  } else {
    content = (
      <WorkspaceRequestList
        workspaceId={workspaceId}
        requests={data.requests}
      />
    );
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Collaboration Requests"
          formLinkPath={appWorkspacePaths.createRequestForm(workspaceId)}
          actions={
            <GrantPermissionMenu
              workspaceId={workspaceId}
              targetType={AppResourceType.CollaborationRequest}
              containerId={workspaceId}
              containerType={AppResourceType.Workspace}
              appliesTo={PermissionItemAppliesTo.Children}
            />
          }
        />
        <PaginatedContent content={content} pagination={pagination} />
      </Space>
    </div>
  );
};

export default WorkspaceRequestsContainer;
