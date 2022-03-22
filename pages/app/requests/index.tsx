import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import UserCollaborationRequestList from "../../../components/app/requests/UserCollaborationRequestList";

export default function UserCollaborationRequestsPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <UserCollaborationRequestList />
    </Space>
  );
}
