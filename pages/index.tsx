import { Space, Typography } from "antd";
import type { NextPage } from "next";
import { cx } from "@emotion/css";
import Features from "../components/web/Features";
import WebHeader from "../components/web/WebHeader";
import { appClasses } from "../components/utils/theme";
import Docs from "../components/web/Docs";

const Home: NextPage = () => {
  return (
    <Space direction="vertical" size={128} style={{ width: "100%" }}>
      <WebHeader />
      <div className={cx(appClasses.main)}>
        <Typography.Title level={2}>
          Files
          <br />
          By Softkave
        </Typography.Title>
      </div>
      <div className={cx(appClasses.main)}>
        <Features />
      </div>
      <div className={cx(appClasses.main)}>
        <Docs />
      </div>
      <div className={cx(appClasses.main)}>
        <Typography.Paragraph>
          &copy; {new Date().getFullYear()} Softkave
        </Typography.Paragraph>
      </div>
    </Space>
  );
};

export default Home;
