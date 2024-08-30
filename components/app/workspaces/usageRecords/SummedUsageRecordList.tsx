"use client";

import ItemList from "@/components/utils/list/ItemList";
import Title from "antd/es/typography/Title";
import {
  UsageCosts,
  UsageRecord,
  UsageRecordCategory,
  Workspace,
} from "fimidara";
import React from "react";
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
          fulfillmentStatus={item.status}
        />
      );
    },
    [workspace, renderItem, usageCosts]
  );

  sortRecords(fulfilledRecords);
  sortRecords(droppedRecords);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Title level={5}>Fulfilled Requests</Title>
        <ItemList
          bordered
          items={fulfilledRecords}
          renderItem={internalRenderItem}
          emptyMessage="No fulfilled usage records yet"
        />
      </div>
      <div className="space-y-4">
        <Title level={5}>Dropped Requests</Title>
        <ItemList
          bordered
          items={droppedRecords}
          renderItem={internalRenderItem}
          emptyMessage="No dropped usage records"
        />
      </div>
    </div>
  );
};

const categoryWeight: Record<UsageRecordCategory, number> = {
  ["storage"]: 1,
  ["storageEver"]: 1,
  ["bin"]: 2,
  ["bout"]: 3,
  ["total"]: 4,
};

function sortRecords(records: UsageRecord[]) {
  return records.sort(
    (r1, r2) => categoryWeight[r1.category] - categoryWeight[r2.category]
  );
}

export default SummedUsageRecordList;
