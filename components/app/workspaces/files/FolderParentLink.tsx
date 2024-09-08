import { StyleableComponentProps } from "@/components/utils/styling/types";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { Folder } from "fimidara";
import Link from "next/link";

export interface FolderParentLinkProps extends StyleableComponentProps {
  folder?: Pick<Folder, "parentId">;
  workspaceId: string;
  children?: React.ReactNode;
}

function FolderParentLink(props: FolderParentLinkProps) {
  const { folder, workspaceId, style, className, children } = props;

  const getParentHref = () => {
    if (!folder) {
      return "#";
    }

    return folder.parentId
      ? kAppWorkspacePaths.folder(workspaceId, folder.parentId)
      : kAppWorkspacePaths.folderList(workspaceId);
  };

  return (
    <Link href={getParentHref()} className={className} style={style}>
      {children}
    </Link>
  );
}

export default FolderParentLink;
