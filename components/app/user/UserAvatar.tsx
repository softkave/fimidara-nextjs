import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { withServerAddr } from "../../../lib/api/addr";
import { getFetchUserImagePath } from "../../../lib/api/endpoints/file";
import { appDimensions } from "../../utils/theme";

export interface IUserAvatarProps {
  userId: string;
  alt: string;
}

export default function UserAvatar(props: IUserAvatarProps) {
  return (
    <Avatar
      icon={<UserOutlined />}
      src={withServerAddr(
        getFetchUserImagePath(
          props.userId,
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
