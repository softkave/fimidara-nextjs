import { useRouter } from "next/router";
import React from "react";
import { getWorkspaceServerSideProps } from "../../../../components/app/workspaces/utils";
import Workspace from "../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../lib/definitions/system";

export interface IWorkspacePageProps {
  workspaceId: string;
}

const WorkspacePage: React.FC<IWorkspacePageProps> = (props) => {
  const { workspaceId } = props;
  const router = useRouter();

  React.useEffect(() => {
    router.push(appWorkspacePaths.rootFolderList(workspaceId));
  }, [workspaceId, router]);

  return <Workspace workspaceId={workspaceId} activeKey="" />;
};

export default withPageAuthRequiredHOC(WorkspacePage);
export const getServerSideProps = getWorkspaceServerSideProps;
