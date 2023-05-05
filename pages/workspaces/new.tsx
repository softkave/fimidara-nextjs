import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { appClasses } from "@/components/utils/theme";

function WorkspaceFormPage() {
  return <WorkspaceForm className={appClasses.main} />;
}

export default withPageAuthRequiredHOC(WorkspaceFormPage);
