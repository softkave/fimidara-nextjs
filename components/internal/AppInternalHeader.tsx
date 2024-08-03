import { css } from "@emotion/css";
import { usePathname, useRouter } from "next/navigation";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { appInternalPaths } from "../../lib/definitions/system";
import AppTabs, { AppTabItem } from "../utils/page/AppTabs";

export interface IAppInternalHeaderProps {
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

export default function AppInternalHeader(props: IAppInternalHeaderProps) {
  const { className, style } = props;
  const router = useRouter();
  const p = usePathname();

  const onChange = (key: string) => {
    router.push(key);
  };

  const items: AppTabItem[] = [
    {
      key: appInternalPaths.waitlist,
      label: `Waitlist`,
      icon: <FiUserPlus />,
    },
    {
      key: appInternalPaths.users,
      label: `Users`,
      icon: <FiUsers />,
    },
    {
      key: appInternalPaths.workspaces,
      label: `Workspaces`,
      icon: <MdOutlineWorkOutline />,
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
  if (!pathname) {
    return undefined;
  }

  const i = pathname.indexOf("/", 1);
  return i === -1 ? pathname.slice(0) : pathname.slice(0, i);
}
