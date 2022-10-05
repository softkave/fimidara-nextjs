import { Space } from "antd";
import LoggedInHeader from "../../../components/app/LoggedInHeader";
import WorkspaceForm from "../../../components/app/workspaces/WorkspaceForm";
import withPageAuthRequiredHOC from "../../../components/hoc/withPageAuthRequired";
import { appClasses } from "../../../components/utils/theme";

function WorkspaceFormPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <LoggedInHeader />
      <WorkspaceForm className={appClasses.main} />
    </Space>
  );
}

export default withPageAuthRequiredHOC(WorkspaceFormPage);
