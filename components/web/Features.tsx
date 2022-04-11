import {
  ApiOutlined,
  BuildOutlined,
  CloudUploadOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { List, Space, Typography } from "antd";

interface IFeature {
  title: string;
  description?: string;
  icon: React.ReactNode;
}

const features: IFeature[] = [
  {
    title:
      "Directly upload files to our servers reducing the load on your servers",
    icon: <CloudUploadOutlined />,
  },
  {
    title: "Restrict access to files based on permission groups",
    icon: <LockOutlined />,
  },
  {
    title:
      "Access files from anywhere, using program access tokens for servers, and client-side access tokens for browsers",
    icon: <KeyOutlined />,
  },
  // {
  //   title:
  //     "Rich text editing, including images, videos, and more, with a simple drag-and-drop interface",
  //   icon: <CloudUploadOutlined />,
  // },
  // {
  //   title:
  //     "Rich UI for managing files, including file uploads, file permissions, and file versions",
  //   icon: <CloudUploadOutlined />,
  // },
  {
    title:
      "Rich UI for managing files, including file uploads, file permissions, and so on",
    icon: <BuildOutlined />,
  },
  {
    title:
      "Rich API for managing files, including file uploads, file permissions, and so on",
    icon: <ApiOutlined />,
  },
];

export default function Features() {
  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      <Typography.Title level={4}>Features</Typography.Title>
      <List
        dataSource={features}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              avatar={item.icon}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Space>
  );
}
