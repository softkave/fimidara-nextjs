import { systemConstants } from "@/lib/definitions/system";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { getReadFileURL } from "fimidara";
import { appDimensions } from "../../utils/theme";

export interface IUserAvatarProps {
  userId: string;
  alt: string;
}

export default function UserAvatar(props: IUserAvatarProps) {
  return (
    <Avatar
      icon={<UserOutlined />}
      src={
        props.userId
          ? getReadFileURL({
              filepath: systemConstants.userImagesFolder + "/" + props.userId,
              width: appDimensions.avatar.width,
              height: appDimensions.avatar.height,
            })
          : undefined
      }
      size="default"
      alt={props.alt}
      shape="circle"
    />
  );
}
