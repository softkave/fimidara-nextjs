import { NextAuthRequest, auth } from "@/auth";
import assert from "assert";
import { Session } from "next-auth";
import { AnyFn, AnyObject } from "softkave-js-utils";
import { OwnServerError } from "../common/error.ts";
import { IRouteContext, wrapRoute } from "./wrapRoute.ts";

export interface IAuthenticatedRequest {
  session: Session;
  userId: string;
  email: string;
  user: Session["user"];
}

type RouteFn = AnyFn<[NextAuthRequest, IRouteContext], Promise<Response>>;

const authFn = auth as unknown as AnyFn<[RouteFn], RouteFn>;

export const wrapAuthenticated = (
  routeFn: AnyFn<
    [NextAuthRequest, IRouteContext, IAuthenticatedRequest],
    Promise<void | AnyObject>
  >
) =>
  authFn(
    wrapRoute(async (req: NextAuthRequest, ctx: IRouteContext) => {
      assert.ok(req.auth, new OwnServerError("Unauthorized", 401));
      const session = req.auth;
      assert.ok(session, new OwnServerError("Unauthorized", 401));
      assert.ok(session.user, new OwnServerError("Unauthorized", 401));
      assert.ok(session.user.id, new OwnServerError("Unauthorized", 401));
      assert.ok(session.user.email, new OwnServerError("Unauthorized", 401));

      return routeFn(req, ctx, {
        session,
        userId: session.user.id,
        email: session.user.email,
        user: session.user,
      });
    })
  );

export const wrapMaybeAuthenticated = (
  routeFn: AnyFn<
    [NextAuthRequest, IRouteContext, IAuthenticatedRequest | null],
    Promise<void | AnyObject>
  >
) =>
  authFn(
    wrapRoute(async (req: NextAuthRequest, ctx: IRouteContext) => {
      const session = req.auth;
      let authenticatedRequest: IAuthenticatedRequest | null = null;

      if (session) {
        assert.ok(session, new OwnServerError("Unauthorized", 401));
        assert.ok(session.user, new OwnServerError("Unauthorized", 401));
        assert.ok(session.user.id, new OwnServerError("Unauthorized", 401));
        assert.ok(session.user.email, new OwnServerError("Unauthorized", 401));
        authenticatedRequest = {
          session,
          userId: session.user.id,
          email: session.user.email,
          user: session.user,
        };
      }

      return routeFn(req, ctx, authenticatedRequest);
    })
  );
