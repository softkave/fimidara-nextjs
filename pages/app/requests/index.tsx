import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import UserCollaborationRequestList from "../../../components/app/requests/UserCollaborationRequestList";

export default function UserCollaborationRequestsPage() {
  return (
    <Space direction="vertical" size={"large"}>
      <AppHeader />
      <UserCollaborationRequestList />
    </Space>
  );
}
