import Razorpay from "razorpay";
import crypto from "crypto";

if (!process.env.RZRPAY_KEY_ID || !process.env.RZRPAY_KEY_SECRET) {
  throw new Error("Razorpay keys not set");
}
const RZRPAY_KEY_ID = process.env.RZRPAY_KEY_ID;
const RZRPAY_KEY_SECRET = process.env.RZRPAY_KEY_SECRET;
export default class Payments {
  static Instance = new Razorpay({
    key_id: RZRPAY_KEY_ID,
    key_secret: RZRPAY_KEY_SECRET,
  });

  static async createOrder({
    amount,
    currency,
    endUserId,
    refrenceId,
    storeFrontId,
    transfers,
  }: {
    amount: number;
    currency: string;
    refrenceId: string;
    endUserId: string;
    storeFrontId: string;
    transfers: {
      account: string;
      on_hold: number;
      on_hold_until: number;
      amount: number;
      currency: string;
    }[];
  }) {
    // console.log(transfers);
    const order = await this.Instance.orders.create({
      amount: amount,
      currency,
      receipt: refrenceId,
      transfers,
      notes: {
        paymentId: refrenceId,
        endUserId,
        storeFrontId,
      },
    });
    return order as Order;
  }
}

export const getPaymentSignature = (orderId: string, paymentId: string) => {
  return crypto
    .createHmac("sha256", RZRPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
};

interface Order {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: 0;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null;
  status: "created";
  attempts: 0;
  notes: {
    endUserId: string;
    storeFrontId: string;
  };
  created_at: number;
}
