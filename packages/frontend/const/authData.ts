import invariant from "tiny-invariant";

const END_USER_OAUTH_SECRET = process.env.END_USER_OAUTH_SECRET!;

invariant(
  typeof END_USER_OAUTH_SECRET === "string",
  "Please Set End User OAuth Secret On Frontend"
);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

invariant(
  typeof ACCESS_TOKEN_SECRET === "string",
  "Please Set End User ACCESS TOKEN Frontend"
);

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

invariant(
  typeof REFRESH_TOKEN_SECRET === "string",
  "Please Set End User REFRESH TOKEN Frontend"
);

export { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, END_USER_OAUTH_SECRET };
