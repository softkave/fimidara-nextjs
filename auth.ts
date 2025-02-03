import { DrizzleAdapter } from "@auth/drizzle-adapter";
import assert from "assert";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db, users as usersTable } from "./db/schema";
import { FimidaraEndpoints } from "./lib/api-internal/endpoints/privateEndpoints.ts";
import { systemConstants } from "./lib/definitions/system.ts";
import { IOAuthUser } from "./lib/definitions/user.ts";

const internalAuthSecret = process.env.INTER_SERVER_AUTH_SECRET;
assert(internalAuthSecret, "INTER_SERVER_AUTH_SECRET is not set");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DrizzleAdapter(db),
  events: {
    createUser: async ({ user }) => {
      assert(user.id, "user ID is not set");
      assert(user.name, "user name is not set");
      assert(user.email, "user email is not set");

      const endpoint = new FimidaraEndpoints({
        serverURL: systemConstants.serverAddr,
      });

      const emailVerifiedAt = (user as typeof usersTable.$inferSelect)
        .emailVerified;
      await endpoint.users.signupWithOAuth({
        oauthUserId: user.id,
        interServerAuthSecret: internalAuthSecret,
        name: user.name,
        email: user.email,
        emailVerifiedAt: emailVerifiedAt?.getTime(),
      });
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const endpoint = new FimidaraEndpoints({
        serverURL: systemConstants.serverAddr,
      });

      const res = await endpoint.users.loginWithOAuth({
        oauthUserId: user.id,
        interServerAuthSecret: internalAuthSecret,
        emailVerifiedAt: user.emailVerified?.getTime(),
      });
      const userData: IOAuthUser = {
        ...user,
        ...res,
      };

      return {
        ...session,
        user: userData,
      };
    },
  },
});
