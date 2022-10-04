import { Divider, Space } from "antd";
import LoggedInHeader from "../../../components/app/LoggedInHeader";
import ChangeUserPassword from "../../../components/app/user/ChangeUserPassword";
import EmailVerification from "../../../components/app/user/EmailVerification";
import UploadUserAvatar from "../../../components/app/user/UploadUserAvatar";
import UserProfile from "../../../components/app/user/UserProfile";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";

function UserSettings() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <LoggedInHeader />
      <Divider orientation="left">Profile picture</Divider>
      <UploadUserAvatar />
      <Divider orientation="left">Email Verification</Divider>
      <EmailVerification />
      <Divider orientation="left">Profile</Divider>
      <UserProfile />
      <Divider orientation="left">Password</Divider>
      <ChangeUserPassword />
    </Space>
  );
}

export default withPageAuthRequired(UserSettings);
