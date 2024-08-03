import { appRootPaths, appUserPaths } from "@/lib/definitions/system.ts";
import { useRequestLogout } from "@/lib/hooks/session/useRequestLogout.ts";
import { Badge, Button, Dropdown, MenuProps, Popover } from "antd";
import Link from "next/link";
import { useUserNode } from "../hooks/useUserNode";
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
    const userAvatarNode = (
      <UserAvatar userId={userId} alt="Your profile picture" />
    );
    return (
      <Button
        style={{
          padding: 0,
          border: "none",
          boxShadow: "none",
        }}
      >
        {withError ? <Badge dot>{userAvatarNode}</Badge> : userAvatarNode}
      </Button>
    );
  };

  if (userNode.renderedNode) {
    return (
      <Popover content={userNode.renderedNode} placement="bottomRight">
        {renderBtnNode(/** userId */ "", /** withError */ true)}
      </Popover>
    );
  }

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      label: <Link href={appUserPaths.workspaces}>App</Link>,
      key: kMenuKeys.app,
    },
    {
      label: <Link href={appRootPaths.docs}>Docs</Link>,
      key: kMenuKeys.docs,
    },
    {
      // TODO: use a /logout page
      label: "Logout",
      key: kMenuKeys.logout,
    },
  ]);

  const onClick: MenuProps["onClick"] = async (info) => {
    if (info.key === kMenuKeys.logout) {
      requestLogout();
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items, onClick, style: { minWidth: "150px" } }}
      placement="bottomRight"
    >
      {renderBtnNode(userNode.assertGet().user.resourceId)}
    </Dropdown>
  );
}
