import { Space, Typography } from "antd";
import type { NextPage } from "next";
import Docs from "../components/web/Docs";
import Features from "../components/web/Features";

const Home: NextPage = () => {
  return (
    <Space direction="vertical" size={128} style={{ width: "100%" }}>
      <Typography.Title level={2}>fimidara</Typography.Title>
      <Features />
      <Docs />
      <Typography.Paragraph>
        &copy; {new Date().getFullYear()} Softkave
      </Typography.Paragraph>
    </Space>
  );
};

export default Home;
