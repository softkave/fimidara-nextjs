import { ApiOutlined, FileTextOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { List, Space, Typography } from "antd";

interface IDoc {
  title: string;
  link: string;
  icon: React.ReactNode;
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
    link: "https://github.com/softkave/fimidara-docs/blob/master/REST-API-latest.md",
  },
  {
    title: "JS SDK",
    icon: <ApiOutlined />,
    link: "https://github.com/softkave/fimidara-js",
  },
];

const classes = {
  link: css({
    textDecoration: "underline",
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
              avatar={item.icon}
            />
          </List.Item>
        )}
      />
    </Space>
  );
}
