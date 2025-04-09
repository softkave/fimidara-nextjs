import { kUserConstants } from "@/lib/definitions/user.ts";
import { wrapRoute } from "@/lib/server/wrapRoute.ts";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = wrapRoute(async (request: NextRequest) => {
  (await cookies()).delete(kUserConstants.httpOnlyJWTCookieName);
});
