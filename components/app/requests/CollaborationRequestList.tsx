import { List } from "antd";
import Link from "next/link";
import React from "react";
import { ICollaborationRequest } from "../../../lib/definitions/collaborationRequest";
import { appRequestsPaths } from "../../../lib/definitions/system";

export interface ICollaborationRequestListProps {
  requests: ICollaborationRequest[];
}

export default function CollaborationRequestList(
  props: ICollaborationRequestListProps
) {
  const { requests } = props;

  return (
    <List
      itemLayout="horizontal"
      dataSource={requests}
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
