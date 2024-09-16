"use client";

import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

export interface IWorkspacePageProps extends IWorkspaceComponentProps {}

const WorkspacePage: FC<IWorkspacePageProps> = (props) => {
  return <WorkspacePageContent {...props} />;
};

const WorkspacePageContent: FC<IWorkspacePageProps> = (props) => {
  const { workspaceId } = props.params;
  const router = useRouter();

  useEffect(() => {
    router.push(kAppWorkspacePaths.folderList(workspaceId));
  }, [workspaceId, router]);

  return null;
};

export default WorkspacePage;
