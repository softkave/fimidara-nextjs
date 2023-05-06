import { useMount } from "ahooks";
import { message, notification, Typography } from "antd";
import { useRouter } from "next/router";
import { formBodyClassName } from "../components/form/classNames";
import { errorMessageNotificatition } from "../components/utils/errorHandling";
import { appComponentConstants } from "../components/utils/utils";
import {
  appRootPaths,
  appWorkspacePaths,
  systemConstants,
} from "../lib/definitions/system";
import { useUserConfirmEmailMutationHook } from "../lib/hooks/mutationHooks";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const verifyEmailHook = useUserConfirmEmailMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error verifying email address.");
      router.push(appRootPaths.home);
    },
  });

  useMount(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get(systemConstants.confirmEmailTokenQueryParam);

    if (!token) {
      notification.error({
        message: "Email address confirmation token not found.",
        description:
          "Please ensure you are using the email confirmation link sent to your email address.",
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
          content: `Email address ${result.body.user.email} verified.`,
          duration: appComponentConstants.messageDuration,
        });
      });
  });

  return (
    <div className={formBodyClassName}>
      <Typography.Text>Verifying email address...</Typography.Text>
    </div>
  );
}
