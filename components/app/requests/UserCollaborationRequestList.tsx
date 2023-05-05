import { appUserPaths } from "@/lib/definitions/system";
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
  const requests = useUserCollaborationRequestsFetchHook({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, resourceList } = requests.store.get({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const isLoading = requests.store.loading || !requests.store.initialized;

  let node: React.ReactNode = null;

  if (requests.store.error) {
    node = (
      <PageError
        messageText={
          getBaseError(requests.store.error) ||
          "Error fetching collaboration requests."
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
