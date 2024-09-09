"use client";

import ChangePasswordWithCurrentPassword from "@/components/app/user/ChangePasswordWithCurrentPassword.tsx";
import EmailVerification from "@/components/app/user/EmailVerification.tsx";
import UploadUserAvatar from "@/components/app/user/UploadUserAvatar.tsx";
import UserContainer from "@/components/app/user/UserContainer.tsx";
import UserProfile from "@/components/app/user/UserProfile.tsx";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { Separator } from "@/components/ui/separator.tsx";

function UserSettings() {
  return usePageAuthRequired({
    render: () => (
      <UserContainer
        render={(session) => (
          <div className="space-y-8">
            <UploadUserAvatar />
            <Separator />
            <h4>Email Verification</h4>
            <EmailVerification session={session} />
            <Separator />
            <h4>Profile</h4>
            <UserProfile session={session} />
            <Separator />
            <h4>Password</h4>
            <ChangePasswordWithCurrentPassword />
          </div>
        )}
      />
    ),
  });
}

export default UserSettings;
