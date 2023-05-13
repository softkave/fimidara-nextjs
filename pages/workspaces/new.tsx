import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";

function WorkspaceFormPage() {
  return <WorkspaceForm />;
}

export default withPageAuthRequiredHOC(WorkspaceFormPage);
