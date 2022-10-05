import { css } from "@emotion/css";
import { List, Space, Typography } from "antd";
import React from "react";
import {
  IUsageRecord,
  UsageCosts,
} from "../../../../lib/definitions/usageRecord";
import { IWorkspace } from "../../../../lib/definitions/workspace";
import SummedUsageRecordListItem from "./SummedUsageRecordListItem";

export interface ISummedUsageRecordListProps {
  workspace: IWorkspace;
  fulfilledRecords: IUsageRecord[];
  droppedRecords: IUsageRecord[];
  usageCosts: UsageCosts;
  renderItem?: (item: IUsageRecord, costPerUnit: number) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const SummedUsageRecordList: React.FC<ISummedUsageRecordListProps> = (
  props
) => {
  const {
    workspace,
    fulfilledRecords,
    droppedRecords,
    usageCosts,
    renderItem,
  } = props;

  const internalRenderItem = React.useCallback(
    (item: IUsageRecord) => {
      if (renderItem) {
        return renderItem(item, usageCosts[item.category]);
      }

      return (
        <List.Item key={item.resourceId}>
          <SummedUsageRecordListItem
            category={item.category}
            usage={item.usage}
            usageCost={item.usageCost}
            costPerUnit={usageCosts[item.category]}
            workspace={workspace}
            fulfillmentStatus={item.fulfillmentStatus}
          />
        </List.Item>
      );
    },
    [workspace, renderItem, usageCosts]
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Typography.Title level={4}>Fulfilled Requests</Typography.Title>
        <List
          className={classes.list}
          itemLayout="horizontal"
          dataSource={fulfilledRecords}
          renderItem={internalRenderItem}
        />
      </Space>
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Typography.Title level={4}>Dropped Requests</Typography.Title>
        <List
          className={classes.list}
          itemLayout="horizontal"
          dataSource={droppedRecords}
          renderItem={internalRenderItem}
        />
      </Space>
    </Space>
  );
};

export default SummedUsageRecordList;
