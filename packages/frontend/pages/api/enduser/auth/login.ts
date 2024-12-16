import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";
import VanillaClient from "../../../../utils/vanillaClient";
import { sign, verify } from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  END_USER_OAUTH_SECRET,
} from "../../../../const/authData";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const bodyData = req.body as {
      email: string;
      password: string;
      storefrontId: string;
    };
    try {
      invariant(typeof bodyData.email === "string");
      invariant(bodyData.email.trim().length !== 0);
      invariant(typeof bodyData.password === "string");
      invariant(bodyData.password.trim().length !== 0);
      invariant(typeof bodyData.storefrontId === "string");
    } catch {
      res.status(403).send("Forbidden");
      return;
    }
    // DO TRPC things
    try {
      const user = await VanillaClient.endUser.oauth.loginEndUser.mutate({
        email: bodyData.email,
        password: bodyData.password,
        oauthSecret: END_USER_OAUTH_SECRET,
        storeFrontId: bodyData.storefrontId,
      });
      if (!user.emailVerified) {
        res.status(403).send("Forbidden");
        return;
      }
      //set token to cookie
      const refreshToken = sign(user, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      setCookie(user.storeFrontId, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        req,
        res,
      });

      //send access token via wire

      const accessToken = sign(user, ACCESS_TOKEN_SECRET, { expiresIn: 20 });
      res.status(200).json({ token: accessToken });
    } catch {
      res.status(403).send("Forbidden");
      return;
    }
  } else {
    // Handle any other HTTP method
    res.status(404).send("Not Found");
  }
}
