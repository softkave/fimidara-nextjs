import assert from "assert";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbURL = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
assert.ok(dbURL, "TURSO_DATABASE_URL is required");
assert.ok(authToken, "TURSO_AUTH_TOKEN is required");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    authToken,
    url: dbURL,
  },
});
