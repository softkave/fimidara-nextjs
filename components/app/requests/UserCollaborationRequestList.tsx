import useUserRequests from "../../../lib/hooks/requests/useUserRequests";
import usePagination from "../../../lib/hooks/usePagination";
import { getBaseError } from "../../../lib/utils/errors";
import { useUserNode } from "../../hooks/useUserNode";
import { PaginatedContent } from "../../utils/page/PaginatedContent";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import CollaborationRequestList from "./CollaborationRequestList";

export default function UserCollaborationRequestList() {
  const user = useUserNode();
  const pagination = usePagination();
  const { error, isLoading, data } = useUserRequests(
    user.data?.user?.resourceId,
    { page: pagination.page, pageSize: pagination.pageSize }
  );

  let node: React.ReactNode = null;
  if (error) {
    node = (
      <PageError
        messageText={getBaseError(error) || "Error fetching requests"}
      />
    );
  } else if (isLoading) {
    node = <PageLoading messageText="Loading requests..." />;
  } else {
    node = <CollaborationRequestList requests={data?.requests || []} />;
  }

  return <PaginatedContent content={node} pagination={pagination} />;
}
