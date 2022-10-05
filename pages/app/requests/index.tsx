import { Space } from "antd";
import LoggedInHeader from "../../../components/app/LoggedInHeader";
import UserCollaborationRequestList from "../../../components/app/requests/UserCollaborationRequestList";
import withPageAuthRequiredHOC from "../../../components/hoc/withPageAuthRequired";

function UserCollaborationRequestsPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <LoggedInHeader />
      <UserCollaborationRequestList />
    </Space>
  );
}

export default withPageAuthRequiredHOC(UserCollaborationRequestsPage);
