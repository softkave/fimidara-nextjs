import { systemConstants } from "@/lib/definitions/system";
import { AppstoreOutlined } from "@ant-design/icons";
import AppAvatar from "../../utils/AppAvatar";

export interface IWorkspaceAvatarProps {
  workspaceId: string;
  alt: string;
}

export default function WorkspaceAvatar(props: IWorkspaceAvatarProps) {
  return (
    <AppAvatar
      icon={<AppstoreOutlined />}
      filepath={systemConstants.workspaceImagesFolder + "/" + props.workspaceId}
      alt={props.alt}
    />
  );
}
