import { Divider, Space } from "antd";
import ChangeUserPassword from "../components/app/user/ChangePasswordWithCurrentPassword";
import EmailVerification from "../components/app/user/EmailVerification";
import UploadUserAvatar from "../components/app/user/UploadUserAvatar";
import UserContainer from "../components/app/user/UserContainer";
import UserProfile from "../components/app/user/UserProfile";
import withPageAuthRequiredHOC from "../components/hoc/withPageAuthRequired";

function UserSettings() {
  return (
    <UserContainer
      render={(session) => (
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
          <Divider orientation="left">Profile picture</Divider>
          <UploadUserAvatar />
          <Divider orientation="left">Email Verification</Divider>
          <EmailVerification session={session} />
          <Divider orientation="left">Profile</Divider>
          <UserProfile session={session} />
          <Divider orientation="left">Password</Divider>
          <ChangeUserPassword />
        </Space>
      )}
    />
  );
}

export default withPageAuthRequiredHOC(UserSettings);
