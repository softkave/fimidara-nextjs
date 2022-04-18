import { useRouter } from "next/router";
import React from "react";
import Workspace from "../../../../components/app/workspaces/Workspace";
import { getWorkspaceServerSideProps } from "../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../components/hoc/withPageAuthRequired";
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

export default withPageAuthRequired(WorkspacePage);
export const getServerSideProps = getWorkspaceServerSideProps;
