import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton.tsx";
import { htmlCharacterCodes } from "../utils/utils.ts";
import styles from "./AppTitle.module.css";
import { useAppMenu } from "./useAppMenu.tsx";
import { CSSProperties } from "react";

export interface IAppTitleProps {
  className?: string;
  style?: CSSProperties;
}

export default function AppTitle(props: IAppTitleProps) {
  const { className, style } = props;
  const { isOpen, toggleAppMenu } = useAppMenu();
  const pathname = usePathname();

  const isDocs = pathname.startsWith(kAppRootPaths.docs);
  return (
    <div
      className={cn("flex", "items-center", "space-x-4", className)}
      style={style}
    >
      <IconButton
        icon={isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={toggleAppMenu}
      />
      <div className={styles.headers}>
        <h1 className="text-xl m-0">
          {isDocs ? (
            <>
              <Link
                href={kAppRootPaths.home}
                className="underline decoration-sky-500"
              >
                fimidara
              </Link>{" "}
              {htmlCharacterCodes.doubleDash}{" "}
              <Link
                href={kAppRootPaths.docs}
                className="underline decoration-sky-500"
              >
                docs
              </Link>
            </>
          ) : (
            <Link
              href={kAppRootPaths.home}
              className="underline decoration-sky-500"
            >
              fimidara
            </Link>
          )}
        </h1>
      </div>
    </div>
  );
}
