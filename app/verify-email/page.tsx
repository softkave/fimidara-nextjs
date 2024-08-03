"use client";

import { errorMessageNotificatition } from "@/components/utils/errorHandling.tsx";
import { appComponentConstants } from "@/components/utils/utils.ts";
import {
  appRootPaths,
  appWorkspacePaths,
  systemConstants,
} from "@/lib/definitions/system.ts";
import { useUserConfirmEmailMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useMount } from "ahooks";
import { message, notification } from "antd";
import Text from "antd/es/typography/Text";
import { useRouter } from "next/navigation";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const verifyEmailHook = useUserConfirmEmailMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error verifying email address");
      router.push(appRootPaths.home);
    },
  });

  useMount(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get(systemConstants.confirmEmailTokenQueryParam);

    if (!token) {
      notification.error({
        message: "Email address confirmation token not found",
        description:
          "Please ensure you are using the email confirmation link sent to your email address",
        duration: appComponentConstants.messageDuration,
      });
      return;
    }

    verifyEmailHook
      .runAsync({
        authToken: token,
      })
      .then((result) => {
        message.success({
          type: "success",
          content: `Email address ${result.body.user.email} verified`,
          duration: appComponentConstants.messageDuration,
        });
      });
  });

  return (
    <div>
      <Text>Verifying email address...</Text>
    </div>
  );
}
