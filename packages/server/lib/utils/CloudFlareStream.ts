import { TRPCError } from "@trpc/server";
import axios from "axios";
import fetch from "node-fetch";
import { AxiomClient } from "./axiom";

export const uploadVideoToCloudflareStream = async (
  url: string,
  creatorId: string,
  key: string
) => {
  const data = {
    url: url,
    requireSignedURLs: true,
    creator: creatorId,
    meta: {
      name: key,
      key: key,
    },
  };
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const TOKEN = process.env.CF_STREAM_AUTH_KEY;
  const URL =
    "https://api.cloudflare.com/client/v4/accounts/" +
    ACCOUNT_ID +
    "/stream/copy";
  // console.log("URL", TOKEN);
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
      body: JSON.stringify(data),
    });
    const body = (await res.json()) as {
      success: boolean;
      result: {
        uid: string;
      };
    };
    // console.log(body);
    if (!body.success) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return body;
  } catch (e) {
    // console.log(e);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
export const getCloudflareStreamSignedUrl = async (
  uid: string,
  ip: string[]
) => {
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const TOKEN = process.env.CF_STREAM_AUTH_KEY;
  const URL =
    "https://api.cloudflare.com/client/v4/accounts/" +
    ACCOUNT_ID +
    "/stream/" +
    uid +
    "/token";
  try {
    // expirry in 30 mins
    const restrictions = {
      exp: Math.floor(Date.now() / 1000) + 30 * 60,
      downloadable: false,
      // accessRules: [
      //   {
      //     type: "ip.src",
      //     ip: ip,
      //     action: "allow",
      //   },
      // ],
    };
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
      body: JSON.stringify(restrictions),
    });

    const body = (await res.json()) as {
      success: boolean;
      result: {
        token: string;
      };
    };
    // console.log("CF RESPONSE", JSON.stringify(body));

    try {
    } catch (e) {
      // console.log("AXIOM ERROR", e);
    }
    // console.log("CF RESPONSE", JSON.stringify(ip));
    if (!body.success) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: JSON.stringify(body),
      });
    }
    const url = `
https://cloudflarestream.com/${body.result.token}/iframe`;
    return url;
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: JSON.stringify({ e: e, ip }),
    });
  }
};
export const deleteVideoFromCloudflareStream = async (uid: string) => {
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const TOKEN = process.env.CF_STREAM_AUTH_KEY;
  const URL =
    "https://api.cloudflare.com/client/v4/accounts/" +
    ACCOUNT_ID +
    "/stream/" +
    uid;
  try {
    const res = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
    });
    const body = (await res.json()) as {
      success: boolean;
    };
    if (!body.success) {
      // throw new TRPCError({
      //   code: "UNAUTHORIZED",
      // });
    }
    return body;
  } catch (e) {
    // throw new TRPCError({
    //   code: "INTERNAL_SERVER_ERROR",
    // });
  }
};
