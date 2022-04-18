import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import WorkspaceForm from "../../../components/app/workspaces/WorkspaceForm";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";
import { appClasses } from "../../../components/utils/theme";

function WorkspaceFormPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <WorkspaceForm className={appClasses.main} />
    </Space>
  );
}

export default withPageAuthRequired(WorkspaceFormPage);
