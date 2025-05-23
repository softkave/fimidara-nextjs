"use client";

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
import { endOfMonth } from "date-fns";
import { UsageRecord, Workspace } from "fimidara";
import React, { useMemo } from "react";
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

  const pagination = usePagination();

  const [dateOption, setDateOption] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const { fromDate, toDate } = useMemo(() => {
    const fromDate = new Date(dateOption.year, dateOption.month, 1);
    const toDate = endOfMonth(fromDate);
    return { fromDate, toDate };
  }, [dateOption]);

  const { fetchState: usageRecordsFetchState } =
    useWorkspaceUsageRecordsFetchHook({
      workspaceId: workspace.resourceId,
      page: pagination.page,
      pageSize: pagination.pageSize,
      query: {
        fromDate: fromDate.getTime(),
        toDate: toDate.getTime(),
      },
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

  const { fulfilledRecords, droppedRecords } = React.useMemo(() => {
    const fulfilledRecords: Record<number, Record<number, UsageRecord[]>> = {};
    const droppedRecords: Record<number, Record<number, UsageRecord[]>> = {};

    if (usageRecords.resourceList) {
      usageRecords.resourceList.forEach((record) => {
        if (record.status === "fulfilled") {
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
      });
    }

    return { fulfilledRecords, droppedRecords };
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
      workspace={workspace}
      onChange={(year, month) =>
        setDateOption({
          year,
          month,
        })
      }
      disabled={!usageRecords.resourceList}
    />
  );

  return (
    <div className="space-y-4">
      <ListHeader label="Usage Records" buttons={controls} />
      <PaginatedContent
        content={contentNode}
        pagination={{ ...pagination, count: usageRecords.count }}
      />
    </div>
  );
};

export default SummedUsageRecordListContainer;
