import { css, cx } from "@emotion/css";
import { List, Space, Typography } from "antd";
import React from "react";
import { IAssignedPermissionGroup } from "../../../../lib/definitions/permissionGroups";
import useWorkspacePermissionGroupList from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { getBaseError } from "../../../../lib/utilities/errors";
import { indexArray } from "../../../../lib/utilities/indexArray";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";

export interface IAssignedPermissionGroupListProps {
  workspaceId: string;
  permissionGroups: IAssignedPermissionGroup[];
  className?: string;
  title?: string;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },

    // "& .ant-list-item": {
    //   padding: "0px !important",
    // },
  }),
  noPermissionGroups: css({
    margin: "64px auto !important",
  }),
};

// TODO: add bulk remove, and add bulk actions to other lists

const AssignedPermissionGroupList: React.FC<
  IAssignedPermissionGroupListProps
> = (props) => {
  const { workspaceId, permissionGroups, className, title } = props;
  const { isLoading, error, data } =
    useWorkspacePermissionGroupList(workspaceId);
  let content: React.ReactNode = null;
  const permissionGroupsMap = React.useMemo(() => {
    return indexArray(data?.permissionGroups, { path: "resourceId" });
  }, [data?.permissionGroups]);

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission groups"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission groups..." />;
  } else if (permissionGroups.length === 0) {
    content = (
      <PageNothingFound
        messageText="No assigned permission groups yet"
        className={classes.noPermissionGroups}
      />
    );
  } else {
    content = (
      <List
        className={cx(classes.list)}
        itemLayout="horizontal"
        dataSource={permissionGroups}
        renderItem={(item) => {
          const permissionGroup = permissionGroupsMap[item.permissionGroupId];

          if (permissionGroup) {
            return (
              <List.Item key={item.permissionGroupId}>
                <List.Item.Meta title={permissionGroup.name} />
              </List.Item>
            );
          }

          return null;
        }}
      />
    );
  }

  return (
    <Space
      direction="vertical"
      size={"small"}
      style={{ width: "100%" }}
      className={className}
    >
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title || "Assigned Permission Groups"}
      </Typography.Title>
      {content}
    </Space>
  );
};

export default AssignedPermissionGroupList;
