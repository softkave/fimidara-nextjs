import {
  useFetchArbitraryFetchState,
  useFetchPaginatedResourceListFetchState,
} from "@/lib/hooks/fetchHookUtils";
import {
  useUsageCostsFetchHook,
  useWorkspaceUsageRecordsFetchHook,
} from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { cast } from "@/lib/utils/fns";
import { Space } from "antd";
import { UsageRecord, Workspace } from "fimidara";
import { first } from "lodash";
import React from "react";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import ListHeader from "../../../utils/list/ListHeader";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import { appClasses } from "../../../utils/theme";
import SummedUsageRecordList from "./SummedUsageRecordList";
import SummedUsageRecordListControls from "./SummedUsageRecordListControls";

export interface ISummedUsageRecordListContainerProps {
  workspace: Workspace;
  renderItem?: (item: UsageRecord, costPerUnit: number) => React.ReactNode;
}

const SummedUsageRecordListContainer: React.FC<
  ISummedUsageRecordListContainerProps
> = (props) => {
  const { workspace, renderItem } = props;
  const [dateOption, setDateOption] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const pagination = usePagination();
  const { fetchState: usageRecordsFetchState } =
    useWorkspaceUsageRecordsFetchHook({
      workspaceId: workspace.resourceId,
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
  const { fetchState: usageCostsFetchState } =
    useUsageCostsFetchHook(undefined);

  const usageRecords = useFetchPaginatedResourceListFetchState(
    usageRecordsFetchState
  );
  const usageCosts = useFetchArbitraryFetchState(usageCostsFetchState);
  const error = usageRecords.error || usageCosts.error;
  const isLoading = usageRecords.isLoading || usageCosts.isLoading;

  let content: React.ReactElement = <span />;

  const { fulfilledRecords, droppedRecords, dateOptions } =
    React.useMemo(() => {
      const fulfilledRecords: Record<
        number,
        Record<number, UsageRecord[]>
      > = {};
      const droppedRecords: Record<number, Record<number, UsageRecord[]>> = {};
      const dateOptionsMap: Record<number, Record<number, number>> = {};
      const dateOptions: Record<number, number[]> = {};

      if (usageRecords.resourceList) {
        usageRecords.resourceList.forEach((record) => {
          if (record.fulfillmentStatus === "fulfilled") {
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
    }, [usageRecords.resourceList]);

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error loading usage records."}
      />
    );
  } else if (isLoading || !usageCosts.data) {
    content = <PageLoading messageText="Loading usage records..." />;
  } else if (usageRecords.resourceList.length === 0) {
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
          <PaginatedContent
            header={<ListHeader label="Usage Records" buttons={controls} />}
            content={
              <SummedUsageRecordList
                fulfilledRecords={monthFulfilledRecords}
                droppedRecords={monthDroppedRecords}
                usageCosts={usageCosts.data.costs}
                workspace={workspace}
                renderItem={renderItem}
              />
            }
            pagination={{ ...pagination, count: usageRecords.count }}
          />
        </Space>
      </div>
    );
  }

  return content;
};

export default SummedUsageRecordListContainer;
