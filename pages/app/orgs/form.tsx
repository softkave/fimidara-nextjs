import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import OrganizationForm from "../../../components/app/orgs/OrganizationForm";

export default function OrganizationFormPage() {
  return (
    <Space direction="vertical" size={"large"}>
      <AppHeader />
      <OrganizationForm />
    </Space>
  );
}
