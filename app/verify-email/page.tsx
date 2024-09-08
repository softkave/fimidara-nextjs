"use client";

import { errorMessageNotificatition } from "@/components/utils/errorHandling.tsx";
import { appComponentConstants } from "@/components/utils/utils.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { systemConstants } from "@/lib/definitions/system.ts";
import { useUserConfirmEmailMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useMount } from "ahooks";
import { useRouter } from "next/navigation";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const { toast } = useToast();
  const router = useRouter();
  const verifyEmailHook = useUserConfirmEmailMutationHook({
    onSuccess(data, params) {
      router.push(kAppWorkspacePaths.workspaces);
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error verifying email address", toast);
      router.push(kAppRootPaths.home);
    },
  });

  useMount(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get(systemConstants.confirmEmailTokenQueryParam);

    if (!token) {
      toast({
        title: "Email address confirmation token not found",
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
        toast({
          title: `Email address ${result.body.user.email} verified`,
          duration: appComponentConstants.messageDuration,
        });
      });
  });

  return <p className="mt-8">Verifying email address...</p>;
}
