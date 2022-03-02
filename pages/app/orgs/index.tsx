import { Space } from "antd";
import type { NextPage } from "next";
import AppHeader from "../../../components/app/AppHeader";

const Orgs: NextPage = () => {
  return (
    <Space direction="vertical" size={"middle"}>
      <AppHeader />
    </Space>
  );
};

export default Orgs;
