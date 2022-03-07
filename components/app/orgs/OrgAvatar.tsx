import { AppstoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { withServerAddr } from "../../../lib/api/addr";
import { getFetchOrgImagePath } from "../../../lib/api/endpoints/file";
import { appDimensions } from "../../utils/theme";

export interface IOrgAvatarProps {
  orgId: string;
  alt: string;
}

export default function OrgAvatar(props: IOrgAvatarProps) {
  return (
    <Avatar
      icon={<AppstoreOutlined />}
      src={withServerAddr(
        getFetchOrgImagePath(
          props.orgId,
          appDimensions.avatar.width,
          appDimensions.avatar.height
        )
      )}
      size="default"
      alt={props.alt}
      shape="circle"
    />
  );
}
