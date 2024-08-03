"use client";

import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useRouter } from "next/navigation";
import React from "react";

export interface IWorkspacePageProps extends IWorkspaceComponentProps {}

const WorkspacePage: React.FC<IWorkspacePageProps> = (props) => {
  return usePageAuthRequired({
    render: () => <WorkspacePageContent {...props} />,
  });
};

const WorkspacePageContent: React.FC<IWorkspacePageProps> = (props) => {
  const { workspaceId } = props.params;
  const router = useRouter();

  React.useEffect(() => {
    router.push(appWorkspacePaths.folderList(workspaceId));
  }, [workspaceId, router]);

  return null;
};

export default WorkspacePage;
