import { getUsageForCost } from "@/lib/definitions/usageRecord";
import { Space, Typography } from "antd";
import {
  UsageRecordCategory,
  UsageRecordFulfillmentStatus,
  Workspace,
} from "fimidara";
import pb from "pretty-bytes";
import React from "react";

export interface ISummedUsageRecordListItemProps {
  workspace: Workspace;
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
  const usedText = fulfillmentStatus === "fulfilled" ? "used" : "dropped";
  const isFulfilled = fulfillmentStatus === "fulfilled";

  if (category === "storage" || category === "bin" || category === "bout") {
    if (threshold && isFulfilled) {
      const thresholdUsage = getUsageForCost(costPerUnit, threshold.budget);
      usageText = `${pb(usage)} of ${pb(thresholdUsage)} ${usedText}`;
    } else {
      usageText = `${pb(usage)} ${usedText}`;
    }
  } else if (category === "total") {
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

  if (category === "storage") {
    labelText = "Storage";
  } else if (category === "bin") {
    labelText = "Bandwidth In";
  } else if (category === "bout") {
    labelText = "Bandwidth Out";
  } else if (category === "total") {
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
