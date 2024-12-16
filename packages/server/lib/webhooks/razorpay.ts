import { ro } from "date-fns/locale";
import { json, Router } from "express";
const router = Router();
import crypto from "crypto";
import { prismaClient } from "../utils/prisma/client";
const RZRPAY_WEBHOOK_SECRET = process.env.RZRPAY_WEBHOOK_SECRET;
const RZRPAY_KEY_ID = process.env.RZRPAY_KEY_ID;
const RZRPAY_KEY_SECRET = process.env.RZRPAY_KEY_SECRET;
if (!RZRPAY_KEY_ID || !RZRPAY_KEY_SECRET || !RZRPAY_WEBHOOK_SECRET) {
  throw new Error("Razorpay keys not set");
}

router.post("/webhook", json(), async (req, res) => {
  console.log("RECIVED WEBHOOk");
  const data = crypto.createHmac("sha256", RZRPAY_WEBHOOK_SECRET).digest("hex");
  if (data !== req.headers["x-razorpay-signature"]) {
    res.status(403).send("Invalid signature");
    return;
  }
  const orderId = req.body.payload.payment.entity.order_id;
  if (req.body.event === "payment.failed") {
    return;
    // uncomment if needed but if payment fails that doesn't mean order failed
    //so have to find something related to that that works easily with that
    await prismaClient.purchase.update({
      where: {
        orderId: orderId,
      },
      data: {
        status: "failed",
      },
    });
    res.sendStatus(200);
  }

  if (req.body.event === "order.paid") {
    await prismaClient.purchase.update({
      where: {
        orderId: orderId,
      },
      data: {
        webHookVerified: true,
        status: "paid",
      },
    });
  }
  res.sendStatus(200);
  return;
});
export const RazorPayWebhookRouter = router;
