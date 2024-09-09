import { systemConstants } from "@/lib/definitions/system";
import { UserOutlined } from "@ant-design/icons";
import AppAvatar from "../../utils/AppAvatar";

export interface IUserAvatarProps {
  userId: string;
  alt: string;
}

export default function UserAvatar(props: IUserAvatarProps) {
  return (
    <AppAvatar
      fallback={<UserOutlined />}
      filepath={
        props.userId
          ? systemConstants.userImagesFolder + "/" + props.userId
          : undefined
      }
      alt={props.alt}
    />
  );
}
