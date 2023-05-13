import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { indexArray } from "@/lib/utils/indexArray";
import { Space, Typography } from "antd";
import { PermissionGroup } from "fimidara";
import React from "react";
import ItemList from "../../../utils/list/ItemList";
import PageError from "../../../utils/page/PageError";
import PageLoading from "../../../utils/page/PageLoading";
import PaginatedContent from "../../../utils/page/PaginatedContent";

export interface IAssignedPermissionGroupListProps {
  workspaceId: string;
  permissionGroups: PermissionGroup[];
  className?: string;
  title?: string;
}

// TODO: add bulk remove, and add bulk actions to other lists

const AssignedPermissionGroupList: React.FC<
  IAssignedPermissionGroupListProps
> = (props) => {
  const { workspaceId, permissionGroups, className, title } = props;
  const pagination = usePagination();
  const { data, error, isLoading } = useWorkspacePermissionGroupList({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;
  const permissionGroupsMap = React.useMemo(() => {
    return indexArray(data?.permissionGroups, { path: "resourceId" });
  }, [data?.permissionGroups]);

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching permission groups."}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading message="Loading permission groups..." />;
  } else {
    content = (
      <ItemList
        items={permissionGroups}
        renderItem={(item: PermissionGroup) => {
          return <div>{item.name}</div>;
        }}
        getId={(item: PermissionGroup) => item.resourceId}
        emptyMessage={"No assigned permission groups yet."}
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      {" "}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title || "Assigned Permission Groups"}
      </Typography.Title>
      <PaginatedContent className={className} content={content} />
    </Space>
  );
};

export default AssignedPermissionGroupList;
