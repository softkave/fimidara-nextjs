import { AppstoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { withServerAddr } from "../../../lib/api/addr";
import { getFetchWorkspaceImagePath } from "../../../lib/api/endpoints/file";
import { appDimensions } from "../../utils/theme";

export interface IWorkspaceAvatarProps {
  workspaceId: string;
  alt: string;
}

export default function WorkspaceAvatar(props: IWorkspaceAvatarProps) {
  return (
    <Avatar
      icon={<AppstoreOutlined />}
      src={withServerAddr(
        getFetchWorkspaceImagePath(
          props.workspaceId,
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
