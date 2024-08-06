import { css } from "@emotion/css";
import { usePathname, useRouter } from "next/navigation";
import { FiGitPullRequest, FiSettings } from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { appUserPaths, appWorkspacePaths } from "../../lib/definitions/system";
import AppTabs, { AppTabItem } from "../utils/page/AppTabs";

export interface IAppUserHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const classes = {
  item: css({
    position: "relative",
    top: "2px",
    borderBottom: "1px solid var(--border-hex)",
  }),
  active: css({
    borderBottom: "1px solid #1677ff",
  }),
};

export default function AppUserHeader(props: IAppUserHeaderProps) {
  const { className, style } = props;
  const router = useRouter();
  const p = usePathname();

  const onChange = (key: string) => {
    router.push(key);
  };

  const items: AppTabItem[] = [
    {
      key: appWorkspacePaths.workspaces,
      label: `Workspaces`,
      icon: <MdOutlineWorkOutline />,
    },
    {
      key: appUserPaths.requests,
      label: `Collaboration Requests`,
      icon: <FiGitPullRequest />,
    },
    {
      key: appUserPaths.settings,
      label: `Settings`,
      icon: <FiSettings />,
    },
  ];
  const activeKey = getTabActiveKeyUsingBasePath(p);

  return (
    <AppTabs
      activeKey={activeKey}
      items={items}
      onChange={onChange}
      style={style}
      className={className}
      activeKeyClassName={classes.active}
      itemClassName={classes.item}
    />
  );
}

function getTabActiveKeyUsingBasePath(pathname?: string | null) {
  const i = pathname?.indexOf("/", 1);
  return i === -1 ? pathname?.slice(0) : pathname?.slice(0, i);
}
