import { compact, last } from "lodash-es";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAppMenu } from "../app/useAppMenu.tsx";
import { SideNav } from "../utils/page/side-nav/SideNav.tsx";
import {
  DOCS_BASE_PATH,
  fimidaraAntdNavItems,
  fimidaraJsSdkAntdNavItems,
  fimidaraRestApiAntdNavItems,
  kDocNavRootKeysList,
  kDocNavRootKeysMap,
} from "./navItems";

// TODO: default open keys
export function DocsSideNav() {
  const { isOpen, toggleAppMenu } = useAppMenu();
  const pathname = usePathname();

  const { openKeys, selectedKeys } = useMemo(() => {
    const docPath = last(pathname?.split(DOCS_BASE_PATH));
    const docKeys = compact(docPath?.split("/"));
    const [rootKey, ...restKeys] = docKeys;
    let openKeys = docKeys;

    if (
      rootKey === kDocNavRootKeysMap.restApi ||
      rootKey === kDocNavRootKeysMap.jsSdk
    ) {
      const [version, endpointKey] = restKeys;
      const parentKeys = endpointKey
        .split("__")
        .filter((p) => !(kDocNavRootKeysList as string[]).includes(p))
        .slice(0, -2);
      openKeys = [rootKey, ...parentKeys, endpointKey];
    }

    openKeys = openKeys.map((key, i) => {
      if (i === 0) return key;
      if (rootKey) return `${rootKey}_${key}`;
      else return key;
    });
    const selectedKeys = compact([last(openKeys)]);
    return { openKeys, selectedKeys };
  }, [pathname]);

  const completeNavItems = fimidaraAntdNavItems.concat(
    fimidaraRestApiAntdNavItems,
    fimidaraJsSdkAntdNavItems
  );

  return (
    <SideNav
      hideOnClose
      items={completeNavItems}
      onClose={toggleAppMenu}
      title="fimidara docs"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      isOpen={isOpen}
    />
  );
}
