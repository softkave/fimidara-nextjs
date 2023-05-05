import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../lib/definitions/system";

export interface IAppWorkspaceHeaderProps {
  workspaceId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AppWorkspaceHeader(props: IAppWorkspaceHeaderProps) {
  const { className, style, workspaceId } = props;
  const router = useRouter();
  const onChange = (key: string) => {
    router.push(key);
  };

  const items: TabsProps["items"] = [
    {
      key: appWorkspacePaths.rootFolderList(workspaceId),
      label: `Files`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: appWorkspacePaths.agentTokenList(workspaceId),
      label: `Agent Tokens`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: appWorkspacePaths.permissionGroupList(workspaceId),
      label: `Permission Groups`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: appWorkspacePaths.collaboratorList(workspaceId),
      label: `Collaborators`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: appWorkspacePaths.usage(workspaceId),
      label: `Usage`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: appWorkspacePaths.workspace(workspaceId),
      label: `Settings`,
      children: `Content of Tab Pane 2`,
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
