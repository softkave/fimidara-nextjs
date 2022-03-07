import React from "react";
import { useSelector } from "react-redux";
import CollaborationRequestList from "./CollaborationRequestList";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import useUserRequests from "../../../lib/hooks/requests/useUserRequests";
import SessionSelectors from "../../../lib/store/session/selectors";

export default function UserCollaborationRequestList() {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const { error, isLoading, data } = useUserRequests(userId);

  if (isLoading) {
    return <PageLoading messageText="Loading requests..." />;
  } else if (error) {
    return (
      <PageError messageText={error?.message || "Error fetching requests"} />
    );
  }

  return <CollaborationRequestList requests={data?.requests || []} />;
}
