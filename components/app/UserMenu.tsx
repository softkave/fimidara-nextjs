import { appRootPaths, appUserPaths } from "@/lib/definitions/system.ts";
import { useRequestLogout } from "@/lib/hooks/session/useRequestLogout.ts";
import Link from "next/link";
import { useUserNode } from "../hooks/useUserNode";
import { DropdownItems, IDropdownItem } from "../ui/dropdown-items.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { insertAntdMenuDivider } from "../utils/utils";
import UserAvatar from "./user/UserAvatar";

const kMenuKeys = {
  logout: "logout",
  docs: "docs",
  app: "app",
};

export default function UserMenu() {
  const { requestLogout } = useRequestLogout();
  const userNode = useUserNode();

  const renderBtnNode = (userId: string, withError?: boolean) => {
    return <UserAvatar userId={userId} alt="Your profile picture" />;
  };

  if (userNode.renderedNode) {
    return (
      <Popover>
        <PopoverTrigger>
          {renderBtnNode(/** userId */ "", /** withError */ true)}
        </PopoverTrigger>
        <PopoverContent>{userNode.renderedNode}</PopoverContent>
      </Popover>
    );
  }

  const items: Array<IDropdownItem> = insertAntdMenuDivider([
    {
      label: (
        <Link href={appUserPaths.workspaces} className="w-full inline-block">
          App
        </Link>
      ),
      key: kMenuKeys.app,
    },
    {
      label: (
        <Link href={appRootPaths.docs} className="w-full inline-block">
          Docs
        </Link>
      ),
      key: kMenuKeys.docs,
    },
    {
      // TODO: use a /logout page
      label: "Logout",
      key: kMenuKeys.logout,
    },
  ]);

  const onClick = async (key: string) => {
    if (key === kMenuKeys.logout) {
      requestLogout();
    }
  };

  return (
    <DropdownItems items={items} onSelect={onClick}>
      {renderBtnNode(userNode.assertGet().user.resourceId)}
    </DropdownItems>
  );
}
