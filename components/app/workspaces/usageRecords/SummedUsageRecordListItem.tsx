import { Space, Typography } from "antd";
import pb from "pretty-bytes";
import React from "react";
import {
  getUsageForCost,
  UsageRecordCategory,
  UsageRecordFulfillmentStatus,
} from "../../../../lib/definitions/usageRecord";
import { IWorkspace } from "../../../../lib/definitions/workspace";

export interface ISummedUsageRecordListItemProps {
  workspace: IWorkspace;
  category: UsageRecordCategory;
  usage: number;
  usageCost: number;
  costPerUnit: number;
  fulfillmentStatus: UsageRecordFulfillmentStatus;
}

const SummedUsageRecordListItem: React.FC<ISummedUsageRecordListItemProps> = (
  props
) => {
  const {
    workspace,
    category,
    usage,
    usageCost,
    costPerUnit,
    fulfillmentStatus,
  } = props;
  const thresholds = workspace.usageThresholds || {};
  const threshold = thresholds[category];
  let usageText = "";
  let labelText = "";
  const usedText =
    fulfillmentStatus === UsageRecordFulfillmentStatus.Fulfilled
      ? "used"
      : "not fulfilled";
  const isFulfilled =
    fulfillmentStatus === UsageRecordFulfillmentStatus.Fulfilled;

  if (
    category === UsageRecordCategory.Storage ||
    category === UsageRecordCategory.BandwidthIn ||
    category === UsageRecordCategory.BandwidthOut
  ) {
    if (threshold && isFulfilled) {
      const thresholdUsage = getUsageForCost(costPerUnit, threshold.budget);
      usageText = `${pb(usage)} of ${pb(thresholdUsage)} ${usedText}`;
    } else {
      usageText = `${pb(usage)} ${usedText}`;
    }
  } else if (category === UsageRecordCategory.Total) {
    if (threshold && isFulfilled) {
      usageText = `${usageCost.toFixed(4)} USD of ${threshold.budget.toFixed(
        4
      )} USD ${usedText}`;
    } else if (!isFulfilled) {
      usageText = `${usageCost.toFixed(4)} USD`;
    } else {
      usageText = `${usageCost.toFixed(4)} USD ${usedText}`;
    }
  }

  if (category === UsageRecordCategory.Storage) {
    labelText = "Storage";
  } else if (category === UsageRecordCategory.BandwidthIn) {
    labelText = "Bandwidth In";
  } else if (category === UsageRecordCategory.BandwidthOut) {
    labelText = "Bandwidth Out";
  } else if (category === UsageRecordCategory.Total) {
    labelText = "Total Cost";
  }

  return (
    <Space direction="vertical" size="small">
      <Typography.Title level={5} type="secondary">
        {labelText}
      </Typography.Title>
      <Typography.Text>{usageText}</Typography.Text>
    </Space>
  );
};

export default SummedUsageRecordListItem;
