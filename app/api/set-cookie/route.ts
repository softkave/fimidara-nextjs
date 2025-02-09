import { FimidaraEndpoints } from "@/lib/api-internal/endpoints/privateEndpoints.ts";
import { systemConstants } from "@/lib/definitions/system.ts";
import {
  kUserConstants,
  setCookieRouteZodSchema,
} from "@/lib/definitions/user.ts";
import { wrapRoute } from "@/lib/server/wrapRoute.ts";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = wrapRoute(async (request: NextRequest) => {
  const params = setCookieRouteZodSchema.parse(await request.json());

  const endpoint = new FimidaraEndpoints({
    serverURL: systemConstants.serverAddr,
  });
  const res = await endpoint.users.getUserData({
    authToken: params.jwtToken,
  });

  assert.ok(res.user.resourceId === params.userId, "Invalid credentials");
  cookies().set(kUserConstants.httpOnlyJWTCookieName, params.jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
});
