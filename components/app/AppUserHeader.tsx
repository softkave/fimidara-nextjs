import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/router";
import { appUserPaths, appWorkspacePaths } from "../../lib/definitions/system";

export interface IAppUserHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AppUserHeader(props: IAppUserHeaderProps) {
  const { className, style } = props;
  const router = useRouter();
  const onChange = (key: string) => {
    router.push(key);
  };

  const items: TabsProps["items"] = [
    {
      key: appWorkspacePaths.workspaces,
      label: `Workspaces`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: appUserPaths.requests,
      label: `Collaboration Requests`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: appUserPaths.settings,
      label: `Settings`,
      children: `Content of Tab Pane 3`,
    },
  ];
  return (
    <Tabs
      defaultActiveKey={appWorkspacePaths.workspaces}
      items={items}
      onChange={onChange}
      style={style}
      className={className}
    />
  );
}
