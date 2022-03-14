import { List, Space, Typography } from "antd";
import React from "react";
import {
  actionLabel,
  AppResourceType,
  appResourceTypeLabel,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import { css, cx } from "@emotion/css";
import PermissionItemMenu from "./PermissionItemMenu";
import useEntityPermissionList from "../../../../lib/hooks/orgs/useEntityPermissionList";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import Middledot from "../../../utils/Middledot";

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

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission items..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching permission items"}
      />
    );
  } else if (data.items.length === 0) {
    content = (
      <PageNothingFound
        className={classes.noPermissionItems}
        messageText="No permission items"
      />
    );
  } else {
    // TODO: add the resource when there's a resource ID

    content = (
      <List
        bordered={false}
        size="small"
        className={cx(classes.list)}
        itemLayout="horizontal"
        dataSource={data.items}
        renderItem={(item) => (
          <List.Item
            key={item.resourceId}
            actions={[
              <PermissionItemMenu item={item} onCompleteDelete={mutate} />,
            ]}
          >
            <Space split={<Middledot />}>
              <Typography.Text>
                {appResourceTypeLabel[item.itemResourceType]}
              </Typography.Text>
              <Typography.Text>{actionLabel[item.action]}</Typography.Text>
            </Space>
          </List.Item>
        )}
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
