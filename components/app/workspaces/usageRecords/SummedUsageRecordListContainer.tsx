import { Space } from "antd";
import { first } from "lodash";
import React from "react";
import {
  IUsageRecord,
  UsageRecordFulfillmentStatus,
} from "../../../../lib/definitions/usageRecord";
import { IWorkspace } from "../../../../lib/definitions/workspace";
import useUsageCosts from "../../../../lib/hooks/useUsageCosts";
import useWorkspaceSummedUsage from "../../../../lib/hooks/workspaces/useWorkspaceSummedUsage";
import { getBaseError } from "../../../../lib/utils/errors";
import { cast } from "../../../../lib/utils/fns";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import SummedUsageRecordList from "./SummedUsageRecordList";
import SummedUsageRecordListControls from "./SummedUsageRecordListControls";

export interface ISummedUsageRecordListContainerProps {
  workspace: IWorkspace;
  renderItem?: (item: IUsageRecord, costPerUnit: number) => React.ReactNode;
}

const SummedUsageRecordListContainer: React.FC<
  ISummedUsageRecordListContainerProps
> = (props) => {
  const { workspace, renderItem } = props;
  const [dateOption, setDateOption] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const records = useWorkspaceSummedUsage({
    workspaceId: workspace.resourceId,
  });

  const usageCosts = useUsageCosts();
  let content: React.ReactElement = <span />;
  const error = records.error || usageCosts.error;
  const isLoading = records.isLoading || usageCosts.isLoading;
  const hasData = records.data && usageCosts.data;
  const { fulfilledRecords, droppedRecords, dateOptions } =
    React.useMemo(() => {
      const fulfilledRecords: Record<
        number,
        Record<number, IUsageRecord[]>
      > = {};
      const droppedRecords: Record<number, Record<number, IUsageRecord[]>> = {};
      const dateOptionsMap: Record<number, Record<number, number>> = {};
      const dateOptions: Record<number, number[]> = {};
      if (records.data) {
        records.data.records.forEach((record) => {
          if (
            record.fulfillmentStatus === UsageRecordFulfillmentStatus.Fulfilled
          ) {
            const yearRecords = fulfilledRecords[record.year] || {};
            const monthRecords = yearRecords[record.month] || [];
            monthRecords.push(record);
            yearRecords[record.month] = monthRecords;
            fulfilledRecords[record.year] = yearRecords;
          } else {
            const yearRecords = droppedRecords[record.year] || {};
            const monthRecords = yearRecords[record.month] || [];
            monthRecords.push(record);
            yearRecords[record.month] = monthRecords;
            droppedRecords[record.year] = yearRecords;
          }

          const monthOptions = dateOptionsMap[record.year] || [];
          monthOptions[record.month] = record.month;
          dateOptionsMap[record.year] = monthOptions;
        });
      }

      for (const year in dateOptionsMap) {
        dateOptions[year] = cast<number[]>(Object.keys(dateOptionsMap[year]));
      }

      return { dateOptions, fulfilledRecords, droppedRecords };
    }, [records.data, usageCosts.data]);

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error loading usage records"}
      />
    );
  } else if (isLoading || !hasData) {
    content = <PageLoading messageText="Loading usage records..." />;
  } else if (records.data?.records.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText={
          "No usage records found for this workspace. Please check back later."
        }
      />
    );
  } else {
    const monthFulfilledRecords =
      fulfilledRecords[dateOption.year]?.[dateOption.month] || [];
    const monthDroppedRecords =
      droppedRecords[dateOption.year]?.[dateOption.month] || [];
    const controls = (
      <SummedUsageRecordListControls
        month={dateOption.month}
        year={dateOption.year}
        options={dateOptions}
        onChange={(year, month) =>
          setDateOption({
            year,
            month: month || first(dateOptions[year])!,
          })
        }
      />
    );

    content = (
      <div className={appClasses.main}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <ListHeader title="Usage Records" actions={controls} />
          <SummedUsageRecordList
            fulfilledRecords={monthFulfilledRecords}
            droppedRecords={monthDroppedRecords}
            usageCosts={usageCosts.data!.costs}
            workspace={workspace}
            renderItem={renderItem}
          />
        </Space>
      </div>
    );
  }

  return content;
};

export default SummedUsageRecordListContainer;
