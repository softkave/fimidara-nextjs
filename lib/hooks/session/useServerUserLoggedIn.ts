import { auth } from "@/auth";
import { kUserConstants } from "@/lib/definitions/user.ts";
import { cookies } from "next/headers";

export async function useServerUserLoggedIn() {
  const jwtToken = (await cookies()).get(
    kUserConstants.httpOnlyJWTCookieName
  )?.value;

  if (jwtToken) {
    return true;
  }

  const session = await auth();
  if (session) {
    return true;
  }

  return false;
}
