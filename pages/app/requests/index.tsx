import { Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import AppHeader from "../../../components/app/AppHeader";
import CollaborationRequestList from "../../../components/app/requests/CollaborationRequestList";
import PageError from "../../../components/utils/PageError";
import PageLoading from "../../../components/utils/PageLoading";
import useUserRequests from "../../../lib/hooks/requests/useUserRequests";
import SessionSelectors from "../../../lib/store/session/selectors";

export default function UserCollaborationRequestListPage() {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const { error, isLoading, data } = useUserRequests(userId);

  if (isLoading) {
    return <PageLoading messageText="Loading requests..." />;
  } else if (error) {
    return (
      <PageError messageText={error?.message || "Error fetching requests"} />
    );
  }

  return (
    <Space direction="vertical" size={"large"}>
      <AppHeader />
      <CollaborationRequestList requests={data?.requests || []} />
    </Space>
  );
}
