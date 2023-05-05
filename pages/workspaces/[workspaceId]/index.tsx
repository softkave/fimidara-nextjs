import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useRouter } from "next/router";
import React from "react";

export interface IWorkspacePageProps {
  workspaceId: string;
}

const WorkspacePage: React.FC<IWorkspacePageProps> = (props) => {
  const { workspaceId } = props;
  const router = useRouter();

  React.useEffect(() => {
    router.push(appWorkspacePaths.rootFolderList(workspaceId));
  }, [workspaceId, router]);

  return null;
};

export default withPageAuthRequiredHOC(WorkspacePage);
export const getServerSideProps = getWorkspaceServerSideProps;
