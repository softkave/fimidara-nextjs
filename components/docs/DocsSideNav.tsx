import { compact, flatten, last, uniq } from "lodash-es";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAppMenu } from "../app/useAppMenu.tsx";
import { SideNav } from "../utils/page/side-nav/old-side-nav.tsx";
import {
  DOCS_BASE_PATH,
  fimidaraAntdNavItems,
  fimidaraJsSdkAntdNavItems,
  fimidaraRestApiAntdNavItems,
  kDocNavRootKeysMap,
} from "./navItems";

// TODO: default open keys
export function DocsSideNav() {
  const { isOpen, toggleAppMenu } = useAppMenu();
  const pathname = usePathname();

  const { openKeys, selectedKeys } = useMemo(() => {
    const docPath = last(pathname?.split(DOCS_BASE_PATH));
    const openKeys = uniq(
      flatten(
        docPath
          ?.split("/")
          .filter((p) => !!p && p !== "v1")
          .map((p) => p.split("__"))
      )
    )
      .reduce((acc, p, i) => {
        if (["get", "post", "delete", "head", "option"].includes(p)) {
          acc[i - 1] = `${acc[i - 1]}__${p}`;
        } else {
          acc.push(p);
        }

        return acc;
      }, [] as string[])
      .reduce((acc, p, i) => {
        if (acc.length && acc[0] !== kDocNavRootKeysMap.fimidara) {
          acc.push(`${acc[i - 1]}__${p}`);
        } else {
          acc.push(p);
        }

        return acc;
      }, [] as string[]);

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
