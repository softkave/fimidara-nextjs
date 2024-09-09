"use client";

import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

export interface IWorkspacePageProps extends IWorkspaceComponentProps {}

const WorkspacePage: FC<IWorkspacePageProps> = (props) => {
  return usePageAuthRequired({
    render: () => <WorkspacePageContent {...props} />,
  });
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
