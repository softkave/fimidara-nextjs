import WorkspaceList from "@/components/app/workspaces/WorkspaceList";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import type { NextPage } from "next";

export interface IWorkspacesPageProps {}

const Workspaces: NextPage<IWorkspacesPageProps> = () => {
  return <WorkspaceList />;
};

export default withPageAuthRequiredHOC(Workspaces);
