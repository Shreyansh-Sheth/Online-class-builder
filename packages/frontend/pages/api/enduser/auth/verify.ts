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
  try {
    if (req.method === "POST") {
      const bodyData = req.body as {
        token: string;
      };
      try {
        invariant(typeof bodyData.token === "string");
        invariant(bodyData.token.trim().length !== 0);
      } catch {
        res.status(403).send("Forbidden");
        return;
      }
      // DO TRPC things
      const user = await VanillaClient.endUser.oauth.verifyToken.mutate({
        oauthSecret: END_USER_OAUTH_SECRET,
        token: bodyData.token,
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
    } else {
      // Handle any other HTTP method
      res.status(404).send("Not Found");
    }
  } catch (e) {
    res.status(403).send("Error Occured");
  }
}
