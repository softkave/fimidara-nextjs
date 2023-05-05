import { Badge, Button, Dropdown, MenuProps, Popover } from "antd";
import { useUserActions } from "../../lib/hooks/actionHooks/useUserActions";
import { useUserNode } from "../hooks/useUserNode";
import UserAvatar from "./user/UserAvatar";

const LOGOUT_MENU_KEY = "logout";

export default function UserMenu() {
  const userActions = useUserActions();
  const userNode = useUserNode({
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

  if (userNode.renderedNode) {
    return (
      <Popover content={userNode.renderedNode} placement="bottomRight">
        {renderBtnNode(/** userId */ "", /** withError */ true)}
      </Popover>
    );
  }

  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: LOGOUT_MENU_KEY,
    },
  ];

  const onClick: MenuProps["onClick"] = async (info) => {
    if (info.key === LOGOUT_MENU_KEY) {
      userActions.logout();
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items, onClick, style: { minWidth: "150px" } }}
    >
      {renderBtnNode(userNode.assertGet().user.resourceId)}
    </Dropdown>
  );
}
