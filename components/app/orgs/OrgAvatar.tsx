import { AppstoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
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
      src={getFetchOrgImagePath(
        props.orgId,
        appDimensions.avatar.width,
        appDimensions.avatar.height
      )}
      size="large"
      alt={props.alt}
      shape="circle"
    />
  );
}
