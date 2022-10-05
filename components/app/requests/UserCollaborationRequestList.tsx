import useUserRequests from "../../../lib/hooks/requests/useUserRequests";
import { getBaseError } from "../../../lib/utilities/errors";
import { useUserNode } from "../../hooks/useUserNode";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import CollaborationRequestList from "./CollaborationRequestList";

export default function UserCollaborationRequestList() {
  const u0 = useUserNode();
  const { error, isLoading, data } = useUserRequests(u0.data?.user?.resourceId);
  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching requests"}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading requests..." />;
  }

  return <CollaborationRequestList requests={data?.requests || []} />;
}
