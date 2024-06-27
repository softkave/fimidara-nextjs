import PageContent02 from "@/components/utils/page/PageContent02";
import { appUserPaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space, Typography } from "antd";
import Link from "next/link";
import ItemList from "../../utils/list/ItemList";
import ListHeader from "../../utils/list/ListHeader";
import PaginatedContent from "../../utils/page/PaginatedContent";
import ThumbnailContent from "../../utils/page/ThumbnailContent";
import { appClasses } from "../../utils/theme";

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
                    <Typography.Text style={{ color: "inherit" }}>
                      Request from{" "}
                      <Typography.Text strong style={{ color: "inherit" }}>
                        {item.workspaceName}
                      </Typography.Text>
                    </Typography.Text>
                  </Link>
                  <Typography.Text type="secondary">
                    Sent {formatDateTime(item.createdAt)}
                  </Typography.Text>
                  {item.expiresAt && (
                    <Typography.Text type="secondary">
                      Expires on {formatDateTime(item.expiresAt)}
                    </Typography.Text>
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
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader label="Your Collaboration Requests" />
      <PaginatedContent
        content={contentNode}
        pagination={{ ...pagination, count }}
      />
    </Space>
  );
}
