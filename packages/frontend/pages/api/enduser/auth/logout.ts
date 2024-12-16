import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";
import VanillaClient from "../../../../utils/vanillaClient";
import { sign, verify } from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  END_USER_OAUTH_SECRET,
} from "../../../../const/authData";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const bodyData = req.body as {
      storeFrontId: string;
    };
    try {
      invariant(typeof bodyData.storeFrontId === "string");
      invariant(bodyData.storeFrontId.trim().length !== 0);
    } catch {
      res.status(403).send("Forbidden");
      return;
    }

    deleteCookie(bodyData.storeFrontId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      req,
      res,
    });
    res.status(200).send("ok");
    return;
  } else {
    // Handle any other HTTP method
    res.status(404).send("Not Found");
  }
}
