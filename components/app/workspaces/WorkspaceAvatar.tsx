import { systemConstants } from "@/lib/definitions/system";
import { AppstoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { getReadFileURL } from "fimidara";
import { appDimensions } from "../../utils/theme";

export interface IWorkspaceAvatarProps {
  workspaceId: string;
  alt: string;
}

export default function WorkspaceAvatar(props: IWorkspaceAvatarProps) {
  return (
    <Avatar
      icon={<AppstoreOutlined />}
      src={getReadFileURL({
        filepath:
          systemConstants.workspaceImagesFolder + "/" + props.workspaceId,
        width: appDimensions.avatar.width,
        height: appDimensions.avatar.height,
      })}
      size="default"
      alt={props.alt}
      shape="circle"
    />
  );
}
