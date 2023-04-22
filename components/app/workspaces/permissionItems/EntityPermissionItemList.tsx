import { css, cx } from "@emotion/css";
import { Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import { IResource, IResourceBase } from "../../../../lib/definitions/resource";
import {
  actionLabel,
  AppResourceType,
  appResourceTypeLabel,
} from "../../../../lib/definitions/system";
import useEntityPermissionList from "../../../../lib/hooks/workspaces/useEntityPermissionList";
import { getBaseError } from "../../../../lib/utils/errors";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import PermissionItemListResourcesContainer, {
  getResourceKey,
} from "./PermissionItemListResourcesContainer";

export interface IEntityPermissionItemListProps {
  workspaceId: string;
  entityId: string;
  entityType: AppResourceType;
}

type IResourceWithNameOptional = IResource<IResourceBase & { name?: string }>;
type IResourceWithName = IResource<IResourceBase & { name: string }>;

const classes = {
  noPermissionItems: css({
    margin: "64px auto !important",
  }),
  cell70px: css({ display: "inline-block", minWidth: "70px" }),
  cell270px: css({ display: "inline-block", minWidth: "270px" }),
};

const EntityPermissionItemList: React.FC<IEntityPermissionItemListProps> = (
  props
) => {
  const { workspaceId, entityId, entityType } = props;
  const { isLoading, error, data } = useEntityPermissionList(
    workspaceId,
    entityId,
    entityType
  );

  let content: React.ReactNode = null;
  const renderItems = React.useCallback(
    (resources: Record<string, IResource>, items: IPermissionItem[]) => {
      const columns: ColumnsType<IPermissionItem> = [
        {
          title: "ID",
          dataIndex: "resourceId",
          key: "resourceId",
          render: (text, item) => (
            <Typography.Text copyable className={classes.cell270px}>
              {item.resourceId}
            </Typography.Text>
          ),
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          render: (text, item) => (
            <Typography.Text className={classes.cell70px}>
              {actionLabel[item.action]}
            </Typography.Text>
          ),
        },
        {
          title: "Permission",
          dataIndex: "grantAccess",
          key: "grantAccess",
          render: (text, item) => (
            <Typography.Text className={classes.cell70px}>
              {item.grantAccess ? "Allow" : "Deny"}
            </Typography.Text>
          ),
        },
        {
          title: "Type",
          dataIndex: "targetType",
          key: "targetType",
          render: (text, item) => (
            <Typography.Text className={classes.cell270px}>
              {appResourceTypeLabel[item.targetType]}
            </Typography.Text>
          ),
        },
        {
          title: "Resource ID",
          dataIndex: "targetId",
          key: "targetId",
          render: (text, item) => (
            <Typography.Text
              copyable={!!item.targetId}
              className={classes.cell270px}
            >
              {item.targetId}
            </Typography.Text>
          ),
        },
        {
          title: "Resource",
          dataIndex: "targetId",
          key: "itemResourceName",
          render: (text, item) => {
            const resource = item.targetId
              ? (resources[
                  getResourceKey({
                    resourceId: item.targetId,
                    resourceType: item.targetType,
                  })
                ] as IResourceWithNameOptional | undefined)
              : undefined;

            return (
              <Typography.Text className={classes.cell270px}>
                {resource?.resource?.name}
              </Typography.Text>
            );
          },
        },
        {
          title: "Permission Container ID",
          dataIndex: "containerId",
          key: "containerId",
          render: (text, item) => (
            <Typography.Text copyable className={classes.cell270px}>
              {item.containerId}
            </Typography.Text>
          ),
        },
        {
          title: "Permission Container",
          dataIndex: "containerId",
          key: "permissionContainerName",
          render: (text, item) => {
            const permissionContainer = resources[
              getResourceKey({
                resourceId: item.containerId,
                resourceType: item.containerType,
              })
            ] as unknown as IResourceWithName | undefined;

            return (
              <Typography.Text className={classes.cell270px}>
                {permissionContainer?.resource.name || item.containerId}
              </Typography.Text>
            );
          },
        },
        {
          title: "Permission Container Type",
          dataIndex: "containerType",
          key: "containerType",
          render: (text, item) => (
            <Typography.Text className={classes.cell270px}>
              {appResourceTypeLabel[item.containerType]}
            </Typography.Text>
          ),
        },
      ];

      return (
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={items}
          scroll={{ x: true }}
        />
      );
    },
    []
  );

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching permission items"}
      />
    );
  } else if (isLoading || !data) {
    content = (
      <PageLoading
        messageText="Loading permission items..."
        className={appClasses.main}
      />
    );
  } else if (data.items.length === 0) {
    content = (
      <PageNothingFound
        className={cx(classes.noPermissionItems, appClasses.main)}
        messageText="No permission items"
      />
    );
  } else {
    content = (
      <PermissionItemListResourcesContainer
        includeItemResource
        includePermissionContainer
        items={data.items}
        workspaceId={workspaceId}
        render={renderItems}
      />
    );
  }

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <Typography.Title level={5} className={appClasses.mainNoPadding}>
        Permission Items
      </Typography.Title>
      {content}
    </Space>
  );
};

export default EntityPermissionItemList;
