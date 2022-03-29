import { List, Space, Typography } from "antd";
import React from "react";
import {
  actionLabel,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import { css, cx } from "@emotion/css";
import PermissionItemMenu from "./PermissionItemMenu";
import useEntityPermissionList from "../../../../lib/hooks/orgs/useEntityPermissionList";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import Middledot from "../../../utils/Middledot";
import { getBaseError } from "../../../../lib/utilities/errors";
import { IResource, IResourceBase } from "../../../../lib/definitions/resource";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import PermissionItemListResourcesContainer, {
  getResourceKey,
} from "./PermissionItemListResourcesContainer";

export interface IEntityPermissionItemListProps {
  orgId: string;
  entityId: string;
  entityType: AppResourceType;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },

    "& .ant-list-item": {
      padding: "0px !important",
    },
  }),
  noPermissionItems: css({
    margin: "64px auto !important",
  }),
};

const EntityPermissionGroupList: React.FC<IEntityPermissionItemListProps> = (
  props
) => {
  const { orgId, entityId, entityType } = props;
  const { isLoading, error, data, mutate } = useEntityPermissionList(
    orgId,
    entityId,
    entityType
  );

  let content: React.ReactNode = null;
  const renderListItem = React.useCallback(
    (
      item: IPermissionItem,
      resource?: IResourceBase & { name?: string },
      permissionOwner?: IResourceBase & { name: string }
    ) => {
      let nameNode = "";

      if (permissionOwner) {
        nameNode = `${permissionOwner.name} (${item.permissionOwnerType}) >> `;
      }

      if (resource) {
        nameNode += `${resource?.name || resource.resourceId} (${
          item.itemResourceType
        })`;
      } else if (item.itemResourceId) {
        nameNode += `${item.itemResourceId} (${item.itemResourceType})`;
      } else {
        nameNode += `${item.itemResourceType}`;
      }

      return (
        <List.Item
          key={item.resourceId}
          actions={[
            <PermissionItemMenu item={item} onCompleteDelete={mutate} />,
          ]}
        >
          <Space split={<Middledot />}>
            <Typography.Text>{actionLabel[item.action]}</Typography.Text>
            <Typography.Text>{nameNode}</Typography.Text>
          </Space>
        </List.Item>
      );
    },
    []
  );

  const renderItems = React.useCallback(
    (resources: Record<string, IResource>, items: IPermissionItem[]) => {
      return (
        <List
          bordered={false}
          size="small"
          className={cx(classes.list)}
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => {
            const resource = item.itemResourceId
              ? (resources[
                  getResourceKey({
                    resourceId: item.itemResourceId,
                    resourceType: item.itemResourceType,
                  })
                ] as (IResourceBase & { name?: string }) | undefined)
              : undefined;

            const permissionOwner = resources[
              getResourceKey({
                resourceId: item.permissionOwnerId,
                resourceType: item.permissionOwnerType,
              })
            ] as unknown as (IResourceBase & { name: string }) | undefined;

            return renderListItem(item, resource, permissionOwner);
          }}
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
    content = <PageLoading messageText="Loading permission items..." />;
  } else if (data.items.length === 0) {
    content = (
      <PageNothingFound
        className={classes.noPermissionItems}
        messageText="No permission items"
      />
    );
  } else {
    content = (
      <PermissionItemListResourcesContainer
        includeItemResource
        includePermissionOwner
        items={data.items}
        orgId={orgId}
        render={renderItems}
      />
    );
  }

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        Permission Items
      </Typography.Title>
      {content}
    </Space>
  );
};

export default EntityPermissionGroupList;
