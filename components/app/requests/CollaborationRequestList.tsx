import { List } from "antd";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { appRequestsPaths } from "../../../lib/definitions/system";
import useUserRequests from "../../../lib/hooks/requests/useUserRequests";
import SessionSelectors from "../../../lib/store/session/selectors";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";

export default function CollaborationRequestList() {
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
    <List
      itemLayout="horizontal"
      dataSource={data?.requests}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <Link href={`${appRequestsPaths.requests}/${item.resourceId}`}>
                Collaboration Request from {item.organizationName}
              </Link>
            }
          />
        </List.Item>
      )}
    />
  );
}
