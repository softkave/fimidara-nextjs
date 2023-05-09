import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { PermissionGroup } from "fimidara";
import Link from "next/link";
import React from "react";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import IconButton from "../../../utils/buttons/IconButton";
import ListHeader from "../../../utils/list/ListHeader";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import { appClasses } from "../../../utils/theme";
import PermissionGroupList from "./PermissionGroupList";

export interface IWorkspacePermissionGroupsProps {
  workspaceId: string;
  renderItem?: (item: PermissionGroup) => React.ReactNode;
  renderList?: (items: PermissionGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspacePermissionGroups: React.FC<IWorkspacePermissionGroupsProps> = (
  props
) => {
  const { workspaceId, menu, renderItem, renderList, renderRoot } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspacePermissionGroupsFetchHook({
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
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching permission groups."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading messageText="Loading permission groups..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No permission groups yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(resourceList)
    ) : (
      <PermissionGroupList
        workspaceId={workspaceId}
        permissionGroups={resourceList}
        renderItem={renderItem}
      />
    );
  }

  content = (
    <PaginatedContent
      content={content}
      pagination={count ? { ...pagination, count } : undefined}
    />
  );

  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          label="Permission Groups"
          buttons={
            <Space>
              <Link
                href={appWorkspacePaths.createPermissionGroupForm(workspaceId)}
              >
                <IconButton icon={<PlusOutlined />} />
              </Link>
              {menu}
            </Space>
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default WorkspacePermissionGroups;
