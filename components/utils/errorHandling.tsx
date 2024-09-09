import { useToast } from "@/hooks/use-toast.ts";
import { kAppUserPaths } from "@/lib/definitions/paths/user.ts";
import { messages } from "@/lib/messages/messages.ts";
import {
  EmailAddressNotVerifiedError,
  getBaseError,
  hasErrorTypes,
  toAppErrorList,
} from "@/lib/utils/errors.ts";
import Link from "next/link";
import React from "react";
import { appComponentConstants, htmlCharacterCodes } from "./utils";

export function enrichErrorMessage(error: any): React.ReactNode {
  if (!error) {
    return "";
  }

  let errorMessage: React.ReactElement = getBaseError(error);
  const hasEmailNotVerifiedError = hasErrorTypes(error, [
    EmailAddressNotVerifiedError.name,
  ]);

  if (hasEmailNotVerifiedError) {
    errorMessage = (
      <span>
        {errorMessage} {htmlCharacterCodes.doubleDash}{" "}
        <Link href={kAppUserPaths.settings}>
          <a>Goto Settings</a>
        </Link>{" "}
        to verify your email address.
      </span>
    );
  }

  return errorMessage;
}

export function errorMessageNotificatition(
  error: any,
  defaultMessage: string | undefined,
  toast: ReturnType<typeof useToast>["toast"]
) {
  const errorMessage =
    enrichErrorMessage(error) || defaultMessage || messages.requestError;
  toast({
    variant: "destructive",
    description: String(errorMessage),
    duration: appComponentConstants.messageDuration,
  });
}

export function throwErrorForUseRequestHandling(error: any) {
  const errorList = toAppErrorList(error);

  if (errorList.length > 0) {
    throw errorList[0];
  }

  throw new Error(messages.requestError);
}
