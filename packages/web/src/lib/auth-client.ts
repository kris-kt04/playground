import { createAuthClient } from "better-auth/client";
import { API_BASE_URL } from "./services";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  basePath: "/api/auth",
});