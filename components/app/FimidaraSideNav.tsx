"use client";

import { appRootPaths } from "@/lib/definitions/system.ts";
import { usePathname } from "next/navigation";
import { DocsSideNav } from "../docs/DocsSideNav.tsx";
import AppSideNav from "./AppSideNav.tsx";

export default function FimidaraSideNav() {
  const pathname = usePathname();

  if (pathname.startsWith(appRootPaths.docs)) {
    return <DocsSideNav />;
  } else {
    return <AppSideNav />;
  }
}
