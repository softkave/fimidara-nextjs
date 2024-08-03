import { usePathname, useRouter } from "next/navigation";
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
import styles from "./AppWorkspaceHeader.module.css";

export interface IAppWorkspaceHeaderProps {
  workspaceId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AppWorkspaceHeader(props: IAppWorkspaceHeaderProps) {
  const { className, style, workspaceId } = props;
  const router = useRouter();
  const p = usePathname();

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
  const activeKey = getTabActiveKeyUsingBasePath(p, items);

  return (
    <AppTabs
      activeKey={activeKey ?? ""}
      items={items}
      onChange={onChange}
      style={style}
      className={className}
      activeKeyClassName={styles.active}
      itemClassName={styles.item}
    />
  );
}

function getTabActiveKeyUsingBasePath(
  pathname: string | null,
  items: AppTabItem[]
) {
  if (!pathname) {
    return null;
  }

  const item = items.find((item) => {
    return pathname?.startsWith(item.key);
  });
  return item?.key;
}
