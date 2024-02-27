import { ApiOutlined, FileTextOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { List, Space, Typography } from "antd";
import AestheticDot from "./AestheticDot";

interface IDoc {
  title: string;
  link: string;
  icon?: React.ReactNode;
}

const docs: IDoc[] = [
  {
    title: "Fimidara Docs",
    icon: <FileTextOutlined />,
    link: "/docs/fimidara/introduction",
  },
  {
    title: "REST API",
    icon: <FileTextOutlined />,
    link: "/docs/fimidara-rest-api/v1",
  },
  {
    title: "JS SDK",
    icon: <ApiOutlined />,
    link: "/docs/fimidara-js-sdk/v1",
  },
];

const classes = {
  link: css({
    textDecoration: "underline",
    color: "#1677ff !important",
  }),
};

export default function Docs() {
  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      <Typography.Title level={4}>Docs</Typography.Title>
      <List
        dataSource={docs}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a href={item.link} className={classes.link}>
                  {item.title}
                </a>
              }
              avatar={<AestheticDot />}
            />
          </List.Item>
        )}
      />
    </Space>
  );
}
