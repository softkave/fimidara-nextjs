import { Space, Table, Typography } from "antd";
import React from "react";
import {
  actionLabel,
  AppResourceType,
  appResourceTypeLabel,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import { css, cx } from "@emotion/css";
import useEntityPermissionList from "../../../../lib/hooks/workspaces/useEntityPermissionList";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { getBaseError } from "../../../../lib/utilities/errors";
import { IResource, IResourceBase } from "../../../../lib/definitions/resource";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import PermissionItemListResourcesContainer, {
  getResourceKey,
} from "./PermissionItemListResourcesContainer";
import { ColumnsType } from "antd/lib/table";

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
  cell200px: css({ display: "inline-block", minWidth: "216px" }),
};

const EntityPermissionGroupList: React.FC<IEntityPermissionItemListProps> = (
  props
) => {
  const { workspaceId, entityId, entityType } = props;
  const { isLoading, error, data, mutate } = useEntityPermissionList(
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
            <Typography.Text copyable className={classes.cell200px}>
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
              {item.grantAccess ? "Deny" : "Allow"}
            </Typography.Text>
          ),
        },
        {
          title: "Type",
          dataIndex: "itemResourceType",
          key: "itemResourceType",
          render: (text, item) => (
            <Typography.Text className={classes.cell200px}>
              {appResourceTypeLabel[item.itemResourceType]}
            </Typography.Text>
          ),
        },
        {
          title: "Resource ID",
          dataIndex: "itemResourceId",
          key: "itemResourceId",
          render: (text, item) => (
            <Typography.Text
              copyable={!!item.itemResourceId}
              className={classes.cell200px}
            >
              {item.itemResourceId}
            </Typography.Text>
          ),
        },
        {
          title: "Resource",
          dataIndex: "itemResourceId",
          key: "itemResourceName",
          render: (text, item) => {
            const resource = item.itemResourceId
              ? (resources[
                  getResourceKey({
                    resourceId: item.itemResourceId,
                    resourceType: item.itemResourceType,
                  })
                ] as IResourceWithNameOptional | undefined)
              : undefined;

            return (
              <Typography.Text className={classes.cell200px}>
                {resource?.resource?.name}
              </Typography.Text>
            );
          },
        },
        {
          title: "Permission Owner ID",
          dataIndex: "permissionOwnerId",
          key: "permissionOwnerId",
          render: (text, item) => (
            <Typography.Text copyable className={classes.cell200px}>
              {item.permissionOwnerId}
            </Typography.Text>
          ),
        },
        {
          title: "Permission Owner",
          dataIndex: "permissionOwnerId",
          key: "permissionOwnerName",
          render: (text, item) => {
            const permissionOwner = resources[
              getResourceKey({
                resourceId: item.permissionOwnerId,
                resourceType: item.permissionOwnerType,
              })
            ] as unknown as IResourceWithName | undefined;

            return (
              <Typography.Text className={classes.cell200px}>
                {permissionOwner?.resource.name || item.permissionOwnerId}
              </Typography.Text>
            );
          },
        },
        {
          title: "Permission Owner Type",
          dataIndex: "permissionOwnerType",
          key: "permissionOwnerType",
          render: (text, item) => (
            <Typography.Text className={classes.cell200px}>
              {appResourceTypeLabel[item.permissionOwnerType]}
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
        includePermissionOwner
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

export default EntityPermissionGroupList;