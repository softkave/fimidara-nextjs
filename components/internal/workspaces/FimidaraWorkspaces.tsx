import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useInternalWorkspacesFetchHook } from "@/lib/hooks/fetchHooks";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import { Space, Typography } from "antd";
import React from "react";

const FimidaraWorkspaces: React.FC<{}> = (props) => {
  const { fetchState } = useInternalWorkspacesFetchHook(undefined);
  const { error, isLoading, data } = useFetchArbitraryFetchState(fetchState);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError message={getBaseError(error) || "Error fetching workspaces"} />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading workspaces..." />;
  } else if (data) {
    content = (
      <ItemList
        items={data.workspaceList}
        renderItem={(item) => {
          return (
            <ThumbnailContent
              key={item.resourceId}
              main={
                <div className={appClasses.thumbnailMain} style={{ rowGap: 4 }}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    Created {formatDateTime(item.createdAt)}
                  </Typography.Text>
                </div>
              }
            />
          );
        }}
        getId={(item) => item.resourceId}
        emptyMessage={"No workspaces"}
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader label="Fimidara Workspaces" />
      <PaginatedContent content={content} />
    </Space>
  );
};

export default FimidaraWorkspaces;
