import { message, notification, Typography } from "antd";
import React from "react";
import { useRequest } from "ahooks";
import { formBodyClassName } from "../../components/form/classNames";
import UserEndpoint from "../../lib/api/endpoints/user";
import {
  appRootPaths,
  appWorkspacePaths,
  systemConstants,
} from "../../lib/definitions/system";
import { useRouter } from "next/router";
import { errorMessageNotificatition } from "../../components/utils/errorHandling";
import { checkEndpointResult } from "../../lib/api/utils";
import { appComponentConstants } from "../../components/utils/utils";
import { saveUserTokenLocal } from "../../lib/hooks/useUser";
import { useDispatch } from "react-redux";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(async () => {
    try {
      const query = new URLSearchParams(window.location.search);
      const token = query.get(systemConstants.confirmEmailTokenQueryParam);

      if (!token) {
        notification.error({
          message: "Email address confirmation token not found",
          description:
            "Please ensure you are using the email confirmation link sent to your email address.",
        });

        return;
      }

      const result = await UserEndpoint.confirmEmailAddress({ token });
      checkEndpointResult(result);
      saveUserTokenLocal(
        dispatch,
        result.user.resourceId,
        result.token,
        result.clientAssignedToken
      );

      message.success({
        type: "success",
        content: "Email address verified.",
        duration: appComponentConstants.messageDuration,
      });

      router.push(appWorkspacePaths.workspaces);
    } catch (error) {
      errorMessageNotificatition(error, "Error verifying email address");
      router.push(appRootPaths.home);
    }
  }, [router]);

  useRequest(onSubmit);
  return (
    <div className={formBodyClassName}>
      <Typography.Text>Verifying email address...</Typography.Text>
    </div>
  );
}
