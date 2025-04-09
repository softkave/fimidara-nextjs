"use client";

import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useRouter } from "next/navigation";
import { FC, use, useEffect } from "react";

export interface IWorkspacePageProps extends IWorkspaceComponentProps {}

const WorkspacePage: FC<IWorkspacePageProps> = (props) => {
  return <WorkspacePageContent {...props} />;
};

const WorkspacePageContent: FC<IWorkspacePageProps> = (props) => {
  const { workspaceId } = use(props.params);
  const router = useRouter();

  useEffect(() => {
    router.push(kAppWorkspacePaths.folderList(workspaceId));
  }, [workspaceId, router]);

  return null;
};

export default WorkspacePage;
