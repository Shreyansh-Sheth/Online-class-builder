import { Router, json } from "express";
import fetch from "node-fetch";
import { prismaClient } from "../utils/prisma/client";
const router = Router();
router.use(json());
router.get("/", (req, res) => {
  res.sendStatus(200);
});
router.post("/", async (req, res) => {
  const { status, uid } = req.body as {
    uid: string;
    status: { state: string };
  };
  const state = status.state;
  if (state === "ready") {
    //update video with uid status in database
    await prismaClient.video.update({
      where: {
        streamUid: uid,
      },
      data: {
        StreamStatus: "READY_TO_STREAM",
      },
    });

    // console.log("URL", await getCloudflareStreamSignedUrl(uid));
  }
  if (state === "error") {
    //update video with uid status in database
    await prismaClient.video.update({
      where: {
        streamUid: uid,
      },
      data: {
        StreamStatus: "ERROR",
      },
    });
  }
  res.sendStatus(200);
});

export default router;
export const setWebhook = async () => {
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const url =
    "https://api.cloudflare.com/client/v4/accounts/" +
    ACCOUNT_ID +
    "/stream/webhook";
  const TOKEN = process.env.CF_STREAM_AUTH_KEY;
  const baseHookUrl = process.env.BASE_HOOK_URL;
  const data = {
    notificationUrl: baseHookUrl + "/webhook/cloudflare",
  };
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
      body: JSON.stringify(data),
    });
    // const body = await res.json();
    // console.log(res);
    console.log("WEBHOOK CF SET");
  } catch (e) {
    console.log(e);
  }
};
// setWebhook();
