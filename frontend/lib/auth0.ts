import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
  // In v4, many defaults (routes, etc.) are handled automatically
  // if not specified, aligning with the /auth/* pattern.
});
