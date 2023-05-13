import { CloseOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Drawer, Menu, Typography } from "antd";
import { compact, last } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useAppResponsive from "../../lib/hooks/useAppResponsive";
import IconButton from "../utils/buttons/IconButton";
import {
  DOCS_BASE_PATH,
  fimidaraAntdNavItems,
  fimidaraJsSdkAntdNavItems,
  fimidaraRestApiAntdNavItems,
} from "./navItems";

export interface IDocsSideNavProps {
  onClose: () => void;
}

const classes = {
  sideNavMenu: css({
    "& .ant-menu-submenu-title": {
      paddingLeft: "16px !important",
    },
    "& .ant-menu-sub": {
      paddingLeft: "12px !important",
    },
    "& .ant-menu-item-divider": {
      margin: 0,
    },
  }),
  sideNavDesktopRoot: css({
    height: "100%",
    overflowY: "scroll",
    overflowX: "hidden",
    "& .ant-menu-inline": {
      height: "100%",
    },
    "& .ant-menu-item": {
      height: "32px !important",
      paddingLeft: "16px !important",
      marginBottom: "0px !important",
      marginTop: "0px !important",
    },
    "& .ant-menu-submenu": {
      // height: "32px !important",
    },
    "& .ant-menu-submenu-title": {
      height: "32px !important",
    },
    // "& .ant-menu-item:not(:last-child)": {},
  }),
  sideNavMobileRoot: css({
    "& .ant-menu-inline": {
      borderRight: "none !important",
    },
    "& .ant-menu-item": {
      paddingLeft: "16px !important",
    },
    "& .ant-drawer-body": {
      padding: "0px !important",
    },
  }),
  sideNavMobileRoot02: css({
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "100%",
  }),
  sideNavMobileHeader: css({
    display: "flex",
    padding: "16px",
    alignItems: "center",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    "& h4": {
      flex: 1,
      marginRight: "16px",
      marginBottom: "0px",
    },
  }),
};

// TODO: default open keys
export function DocsSideNav(props: IDocsSideNavProps) {
  const { onClose } = props;
  const router = useRouter();
  const responsive = useAppResponsive();
  const pathname = router.asPath;
  const { openKeys, selectedKeys } = useMemo(() => {
    const currentDocsPath = last(pathname.split(DOCS_BASE_PATH));
    const openKeys = compact(currentDocsPath?.split("/"));
    const selectedKeys = compact([last(openKeys)]);
    return { openKeys, selectedKeys };
  }, [pathname]);

  const menuNode = (
    <Menu
      items={fimidaraAntdNavItems.concat(
        fimidaraRestApiAntdNavItems,
        fimidaraJsSdkAntdNavItems
      )}
      mode="inline"
      style={{ minWidth: "300px" }}
      className={classes.sideNavMenu}
      selectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
    />
  );

  const isLg = responsive?.lg;

  if (isLg) {
    return <div className={classes.sideNavDesktopRoot}>{menuNode}</div>;
  } else {
    return (
      <Drawer
        placement="left"
        visible
        closable={false}
        onClose={onClose}
        className={classes.sideNavMobileRoot}
      >
        <div className={classes.sideNavMobileRoot02}>
          <div className={classes.sideNavMobileHeader}>
            <Typography.Title level={4}>Fimidara Docs</Typography.Title>
            <IconButton icon={<CloseOutlined />} onClick={onClose} />
          </div>
          {menuNode}
        </div>
      </Drawer>
    );
  }
}
