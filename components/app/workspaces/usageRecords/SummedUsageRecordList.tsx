"use client";

import ItemList from "@/components/utils/list/ItemList";
import {
  UsageCosts,
  UsageRecord,
  UsageRecordCategory,
  Workspace,
} from "fimidara";
import { compact } from "lodash-es";
import React from "react";
import { indexArray } from "softkave-js-utils";
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
  const { workspace, usageCosts, renderItem } = props;

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

  const sortedFulfilledRecords = sortRecords(props.fulfilledRecords);
  const sortedDroppedRecords = sortRecords(props.droppedRecords);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h5>Fulfilled Requests</h5>
        <ItemList
          bordered
          items={sortedFulfilledRecords}
          renderItem={internalRenderItem}
          emptyMessage="No fulfilled usage records yet"
          space="md"
        />
      </div>
      <div className="space-y-4">
        <h5>Dropped Requests</h5>
        <ItemList
          bordered
          items={sortedDroppedRecords}
          renderItem={internalRenderItem}
          emptyMessage="No dropped usage records"
          space="md"
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
  const rM = indexArray(records, {
    indexer: (r) => r.category,
    reducer: (r, i, arr, e) => {
      if (e) {
        return {
          ...r,
          usage: e.usage + r.usage,
          usageCost: e.usageCost + r.usageCost,
        };
      }
      return r;
    },
  });

  return compact(Object.values(rM)).sort(
    (r1, r2) => categoryWeight[r1.category] - categoryWeight[r2.category]
  );
}

export default SummedUsageRecordList;
