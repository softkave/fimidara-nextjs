"use client";

import { ApiOutlined, FileTextOutlined } from "@ant-design/icons";

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

export default function Docs() {
  return (
    <div className="space-y-4">
      <h4 className="text-2xl">Docs</h4>
      <ul>
        {docs.map((item) => (
          <li key={item.link}>
            <a href={item.link} className="underline decoration-sky-500">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
