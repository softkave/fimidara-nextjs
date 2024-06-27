import ListHeader from "@/components/utils/list/ListHeader";
import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import {
  useFetchArbitraryFetchState,
  useFetchPaginatedResourceListFetchState,
} from "@/lib/hooks/fetchHookUtils";
import {
  useUsageCostsFetchHook,
  useWorkspaceUsageRecordsFetchHook,
} from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { cast } from "@/lib/utils/fns";
import { Space } from "antd";
import { UsageRecord, Workspace } from "fimidara";
import { first } from "lodash";
import React from "react";
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
  const isDataFetched = usageRecords.isDataFetched && !!usageCosts.data;

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

  const data =
    usageCosts.data && usageRecords.resourceList
      ? {
          resourceList: usageRecords.resourceList,
          usageCostsData: usageCosts.data,
        }
      : undefined;
  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={data}
      defaultErrorMessage="Error fetching usage records"
      defaultLoadingMessage="Loading usage records..."
      render={(data) => {
        if (data.resourceList.length) {
          const monthFulfilledRecords =
            fulfilledRecords[dateOption.year]?.[dateOption.month] || [];
          const monthDroppedRecords =
            droppedRecords[dateOption.year]?.[dateOption.month] || [];

          return (
            <SummedUsageRecordList
              fulfilledRecords={monthFulfilledRecords}
              droppedRecords={monthDroppedRecords}
              usageCosts={data.usageCostsData.costs}
              workspace={workspace}
              renderItem={renderItem}
            />
          );
        } else {
          return (
            <PageNothingFound
              message={
                "No usage records found for this workspace. Please check back later"
              }
            />
          );
        }
      }}
    />
  );

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
      disabled={!usageRecords.resourceList}
    />
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <ListHeader label="Usage Records" buttons={controls} />
      <PaginatedContent
        content={contentNode}
        pagination={{ ...pagination, count: usageRecords.count }}
      />
    </Space>
  );
};

export default SummedUsageRecordListContainer;
