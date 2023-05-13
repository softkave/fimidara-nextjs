import { css } from "@emotion/css";
import { useRouter } from "next/router";
import {
  FiFile,
  FiKey,
  FiSettings,
  FiUserPlus,
  FiUsers,
  FiVoicemail,
} from "react-icons/fi";
import { TbLockAccess } from "react-icons/tb";
import { appWorkspacePaths } from "../../lib/definitions/system";
import AppTabs, { AppTabItem } from "../utils/page/AppTabs";

export interface IAppWorkspaceHeaderProps {
  workspaceId: string;
  className?: string;
  style?: React.CSSProperties;
}

const classes = {
  item: css({
    position: "relative",
    top: "2px",
    borderBottom: "2px solid #f0f0f0",
  }),
  active: css({
    borderBottom: "2px solid #1677ff",
  }),
};

export default function AppWorkspaceHeader(props: IAppWorkspaceHeaderProps) {
  const { className, style, workspaceId } = props;
  const router = useRouter();
  const onChange = (key: string) => {
    router.push(key);
  };

  const items: AppTabItem[] = [
    {
      key: appWorkspacePaths.folderList(workspaceId),
      label: `Files`,
      icon: <FiFile />,
    },
    {
      key: appWorkspacePaths.agentTokenList(workspaceId),
      label: `Agent Tokens`,
      // icon: <TbLockAccess />
      icon: <FiKey />,
    },
    {
      key: appWorkspacePaths.permissionGroupList(workspaceId),
      label: `Permission Groups`,
      icon: <TbLockAccess />,
    },
    {
      key: appWorkspacePaths.collaboratorList(workspaceId),
      label: `Collaborators`,
      icon: <FiUsers />,
    },
    {
      key: appWorkspacePaths.requestList(workspaceId),
      label: `Requests`,
      icon: <FiUserPlus />,
    },
    {
      key: appWorkspacePaths.usage(workspaceId),
      label: `Usage`,
      icon: <FiVoicemail />,
    },
    {
      key: appWorkspacePaths.updateWorkspaceForm(workspaceId),
      label: `Settings`,
      icon: <FiSettings />,
    },
  ];
  const activeKey = getTabActiveKeyUsingBasePath(router.asPath, items);

  return (
    <AppTabs
      activeKey={activeKey ?? ""}
      items={items}
      onChange={onChange}
      style={style}
      className={className}
      activeKeyClassName={classes.active}
      itemClassName={classes.item}
    />
  );
}

function getTabActiveKeyUsingBasePath(pathname: string, items: AppTabItem[]) {
  const item = items.find((item) => {
    return pathname.startsWith(item.key);
  });
  return item?.key;
}
