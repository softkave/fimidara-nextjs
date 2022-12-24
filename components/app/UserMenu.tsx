import { Badge, Button, Dropdown, Menu, Popover } from "antd";
import Link from "next/link";
import { appUserPaths } from "../../lib/definitions/system";
import { useUserActions } from "../../lib/hooks/actionHooks/useUserActions";
import { useUserNode } from "../hooks/useUserNode";
import UserAvatar from "./user/UserAvatar";

const LOGOUT_MENU_KEY = "logout";

export default function UserMenu() {
  const userActions = useUserActions();
  const { renderNode, assertGet } = useUserNode({
    renderNode: { withoutMargin: true },
  });

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

  if (renderNode) {
    return (
      <Popover content={renderNode} placement="bottomRight">
        {renderBtnNode(/** userId */ "", /** withError */ true)}
      </Popover>
    );
  }

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu
          onClick={async (info) => {
            if (info.key === LOGOUT_MENU_KEY) {
              userActions.logout();
            }
          }}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={appUserPaths.settings}>
            <Link href={appUserPaths.settings}>Settings</Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={LOGOUT_MENU_KEY}>Logout</Menu.Item>
        </Menu>
      }
    >
      {renderBtnNode(assertGet().user.resourceId)}
    </Dropdown>
  );
}
