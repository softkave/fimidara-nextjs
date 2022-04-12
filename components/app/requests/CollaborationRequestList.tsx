import { List, Typography } from "antd";
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
          <Link href={`${appRequestsPaths.requests}/${item.resourceId}`}>
            <a>
              Request from{" "}
              <Typography.Text strong>{item.workspaceName}</Typography.Text>
            </a>
          </Link>
        </List.Item>
      )}
    />
  );
}
