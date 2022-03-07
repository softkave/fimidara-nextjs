import { Space } from "antd";
import AppHeader from "../../../components/app/AppHeader";
import OrganizationForm from "../../../components/app/orgs/OrganizationForm";
import { appClasses } from "../../../components/utils/theme";

export default function OrganizationFormPage() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <OrganizationForm className={appClasses.main} />
    </Space>
  );
}
