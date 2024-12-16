import { z } from "zod";

export const createOrderId = z.object({
  courseId: z.string(),
});

export const successPaymentCallback = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});
