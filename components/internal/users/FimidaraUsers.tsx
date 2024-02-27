import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useInternalUsersFetchHook } from "@/lib/hooks/fetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space, Tag, Typography } from "antd";
import React from "react";

const FimidaraUsers: React.FC<{}> = (props) => {
  const { fetchState } = useInternalUsersFetchHook(undefined);
  const { error, isLoading, data } = useFetchArbitraryFetchState(fetchState);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError message={getBaseError(error) || "Error fetching users"} />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading users..." />;
  } else if (data) {
    content = (
      <ItemList
        items={data.users}
        renderItem={(item) => {
          return (
            <ThumbnailContent
              key={item.resourceId}
              main={
                <div className={appClasses.thumbnailMain} style={{ rowGap: 4 }}>
                  <Typography.Text>
                    {item.firstName} {item.lastName}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {item.email}
                  </Typography.Text>
                  <div>
                    <Tag>
                      {item.isEmailVerified
                        ? "Email verified"
                        : "Not email verified"}
                    </Tag>
                  </div>
                </div>
              }
            />
          );
        }}
        getId={(item) => item.resourceId}
        emptyMessage={"No users"}
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader label="Fimidara Users" />
      <PaginatedContent content={content} />
    </Space>
  );
};

export default FimidaraUsers;
