import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import UserCollaborationRequestList from "../../../components/app/requests/UserCollaborationRequestList";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";

function UserCollaborationRequestsPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <UserCollaborationRequestList />
    </Space>
  );
}

export default withPageAuthRequired(UserCollaborationRequestsPage);
