"use client";

import ItemList from "@/components/utils/list/ItemList.tsx";
import ListHeader from "@/components/utils/list/ListHeader.tsx";
import PageContent02 from "@/components/utils/page/PageContent02";
import PaginatedContent from "@/components/utils/page/PaginatedContent.tsx";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent.tsx";
import { appClasses } from "@/components/utils/theme.ts";
import { appUserPaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { formatDateTime } from "@/lib/utils/dateFns";
import Text from "antd/es/typography/Text";
import Link from "next/link";

export default function UserCollaborationRequestList() {
  const pagination = usePagination();
  const { fetchState } = useUserCollaborationRequestsFetchHook({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching collaboration requests"
      defaultLoadingMessage="Loading collaboration requests..."
      render={(data) => (
        <ItemList
          bordered
          items={data}
          renderItem={(item) => (
            <ThumbnailContent
              key={item.resourceId}
              main={
                <div className={appClasses.thumbnailMain}>
                  <Link href={`${appUserPaths.request(item.resourceId)}`}>
                    <Text style={{ color: "inherit" }}>
                      Request from{" "}
                      <Text strong style={{ color: "inherit" }}>
                        {item.workspaceName}
                      </Text>
                    </Text>
                  </Link>
                  <Text type="secondary">
                    Sent {formatDateTime(item.createdAt)}
                  </Text>
                  {item.expiresAt && (
                    <Text type="secondary">
                      Expires on {formatDateTime(item.expiresAt)}
                    </Text>
                  )}
                </div>
              }
            />
          )}
          emptyMessage="You do not have any collaboration requests"
        />
      )}
    />
  );

  return (
    <div className="space-y-8">
      <ListHeader label="Your Collaboration Requests" />
      <PaginatedContent
        content={contentNode}
        pagination={{ ...pagination, count }}
      />
    </div>
  );
}
