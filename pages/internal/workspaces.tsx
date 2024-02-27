import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import FimidaraWorkspaces from "@/components/internal/workspaces/FimidaraWorkspaces";
import type { NextPage } from "next";

export interface IWorkspacesPageProps {}

const WorkspacesPage: NextPage<IWorkspacesPageProps> = () => {
  return <FimidaraWorkspaces />;
};

export default withPageAuthRequiredHOC(WorkspacesPage);
