import { Space, Typography } from "antd";
import { UsageCosts, UsageRecord, Workspace } from "fimidara";
import React from "react";
import ItemList from "../../../utils/list/ItemList";
import SummedUsageRecordListItem from "./SummedUsageRecordListItem";

export interface ISummedUsageRecordListProps {
  workspace: Workspace;
  fulfilledRecords: UsageRecord[];
  droppedRecords: UsageRecord[];
  usageCosts: UsageCosts;
  renderItem?: (item: UsageRecord, costPerUnit: number) => React.ReactNode;
}

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
    (item: UsageRecord) => {
      if (renderItem) {
        return renderItem(item, usageCosts[item.category]);
      }

      return (
        <SummedUsageRecordListItem
          category={item.category}
          usage={item.usage}
          usageCost={item.usageCost}
          costPerUnit={usageCosts[item.category]}
          workspace={workspace}
          fulfillmentStatus={item.fulfillmentStatus}
        />
      );
    },
    [workspace, renderItem, usageCosts]
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Typography.Title level={4}>Fulfilled Requests</Typography.Title>
        <ItemList items={fulfilledRecords} renderItem={internalRenderItem} />
      </Space>
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Typography.Title level={4}>Dropped Requests</Typography.Title>
        <ItemList items={droppedRecords} renderItem={internalRenderItem} />
      </Space>
    </Space>
  );
};

export default SummedUsageRecordList;
