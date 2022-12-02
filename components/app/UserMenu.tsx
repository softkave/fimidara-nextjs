import { CaretDownOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Menu, Popover, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { appRootPaths, appUserPaths } from "../../lib/definitions/system";
import SessionActions from "../../lib/store/session/actions";
import { useUserNode } from "../hooks/useUserNode";
import UserAvatar from "./user/UserAvatar";

const LOGOUT_MENU_KEY = "logout";

export default function UserMenu() {
  const { renderNode, assertGet } = useUserNode({
    renderNode: { withoutMargin: true },
  });
  const dispatch = useDispatch();
  const router = useRouter();

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
        {withError ? (
          <Badge dot>{userAvatarNode}</Badge>
        ) : (
          <Space size={"small"}>
            {userAvatarNode}
            <CaretDownOutlined />
          </Space>
        )}
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
              // TODO: delete all cache keys
              router.push(appRootPaths.home);
              dispatch(SessionActions.logoutUser());
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
