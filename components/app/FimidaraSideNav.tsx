"use client";

import { usePathname } from "next/navigation";
import { DocsSideNav } from "../docs/DocsSideNav.tsx";
import AppSideNav from "./AppSideNav.tsx";
import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";

export default function FimidaraSideNav() {
  const pathname = usePathname();

  if (pathname.startsWith(kAppRootPaths.docs)) {
    return <DocsSideNav />;
  } else {
    return <AppSideNav />;
  }
}
