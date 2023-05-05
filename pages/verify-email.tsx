import { useRequest } from "ahooks";
import { message, notification, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { formBodyClassName } from "../components/form/classNames";
import { errorMessageNotificatition } from "../components/utils/errorHandling";
import { appComponentConstants } from "../components/utils/utils";
import { getPrivateFimidaraEndpointsUsingUserToken } from "../lib/api/fimidaraEndpoints";
import {
  appRootPaths,
  appWorkspacePaths,
  systemConstants,
} from "../lib/definitions/system";
import { saveUserTokenLocal } from "../lib/hooks/useUser";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(async () => {
    try {
      const query = new URLSearchParams(window.location.search);
      const token = query.get(systemConstants.confirmEmailTokenQueryParam);
      const endpoints = getPrivateFimidaraEndpointsUsingUserToken();

      if (!token) {
        notification.error({
          message: "Email address confirmation token not found.",
          description:
            "Please ensure you are using the email confirmation link sent to your email address.",
        });

        return;
      }

      const result = await endpoints.users.confirmEmailAddress({
        authToken: token,
      });
      saveUserTokenLocal(
        dispatch,
        result.body.user.resourceId,
        result.body.token,
        result.body.clientAssignedToken
      );
      message.success({
        type: "success",
        content: "Email address verified.",
        duration: appComponentConstants.messageDuration,
      });
      router.push(appWorkspacePaths.workspaces);
    } catch (error) {
      errorMessageNotificatition(error, "Error verifying email address.");
      router.push(appRootPaths.home);
    }
  }, [router, dispatch]);

  useRequest(onSubmit);
  return (
    <div className={formBodyClassName}>
      <Typography.Text>Verifying email address...</Typography.Text>
    </div>
  );
}
