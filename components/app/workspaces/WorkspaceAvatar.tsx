import { Computer } from "lucide-react";
import AppAvatar from "../../utils/AppAvatar";

export interface IWorkspaceAvatarProps {
  workspaceId: string;
  alt: string;
  className?: string;
}

export default function WorkspaceAvatar(props: IWorkspaceAvatarProps) {
  return (
    <AppAvatar
      fallback={<Computer className="h-4 w-4" />}
      // filepath={systemConstants.workspaceImagesFolder + "/" + props.workspaceId}
      alt={props.alt}
      className={props.className}
    />
  );
}
