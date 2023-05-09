import { appUserPaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import { Typography } from "antd";
import { CollaborationRequestForUser } from "fimidara";
import Link from "next/link";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import ItemList from "../../utils/list/ItemList";
import PaginatedContent from "../../utils/page/PaginatedContent";

export default function UserCollaborationRequestList() {
  const pagination = usePagination();
  const { fetchState } = useUserCollaborationRequestsFetchHook({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let node: React.ReactNode = null;

  if (error) {
    node = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration requests."
        }
      />
    );
  } else if (isLoading) {
    node = <PageLoading messageText="Loading requests..." />;
  } else {
    node = (
      <ItemList
        items={resourceList}
        renderItem={(item: CollaborationRequestForUser) => (
          <div>
            <Link href={`${appUserPaths.request(item.resourceId)}`}>
              <Typography.Text>
                Request from{" "}
                <Typography.Text strong>{item.workspaceName}</Typography.Text>
              </Typography.Text>
            </Link>
            <Typography.Text>
              Send {formatDateTime(item.createdAt)}
            </Typography.Text>
            {item.expiresAt && (
              <Typography.Text>
                Expires on {formatDateTime(item.expiresAt)}
              </Typography.Text>
            )}
          </div>
        )}
      />
    );
  }

  return (
    <PaginatedContent content={node} pagination={{ ...pagination, count }} />
  );
}
