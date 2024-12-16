import { t } from "../../utils/trpc/v10";
import { tEndUserProtectedProcedure } from "../../utils/trpc/v10enduser";
import {
  createOrderId,
  successPaymentCallback,
} from "@tutor/validation/lib/enduser/payment";
import { TRPCError } from "@trpc/server";
import Payments, { getPaymentSignature } from "../../thirdparty/payments";
import { courseId } from "@tutor/validation/lib/course";
export const endUserPaymentRouter = t.router({
  createOrderId: tEndUserProtectedProcedure
    .input(createOrderId)
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.PrismaClient.storeFront.findUnique({
        where: {
          id: ctx.endUserData.storeFrontId,
        },
        include: {
          storeFrontPaymentProcessingDetails: true,
        },
      });
      if (
        store?.status !== "LIVE" ||
        !store.storeFrontPaymentProcessingDetails?.razorpayAccountId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Store Is Not Live",
        });
      }
      const course = await ctx.PrismaClient.courses.findUnique({
        where: {
          id: input.courseId,
        },
      });
      if (!course || course?.storeFrontId !== ctx.endUserData.storeFrontId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Course Not Found",
        });
      }
      //check if user already paid for this course
      const purchase = await ctx.PrismaClient.purchase.findFirst({
        where: {
          coursesId: input.courseId,
          endUserId: ctx.endUserData.id,
          status: "paid",
        },
      });
      if (purchase) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Already Paid",
        });
      }

      if (course.price === 0) {
        await ctx.PrismaClient.purchase.create({
          data: {
            amount: 0,
            coursesId: input.courseId,
            endUserId: ctx.endUserData.id,
            paymentId: "FREE",
            currency: "INR",
            sellersCut: 0,
            status: "paid",
            storeFrontId: ctx.endUserData.storeFrontId,
          },
        });
        return { free: true };
      }
      //Genrate Order Id
      const totalPrice = course.price * 100;
      const merchantPercentage =
        100 - store.storeFrontPaymentProcessingDetails.percentCut;

      const merchantCut = Math.round(merchantPercentage * totalPrice) / 100;
      console.log("merchantCut", merchantPercentage);
      // return;
      const purchaseData = await ctx.PrismaClient.purchase.create({
        data: {
          amount: totalPrice,
          sellersCut: merchantCut,
          currency: "INR",
          coursesId: input.courseId,
          endUserId: ctx.endUserData.id,
          storeFrontId: ctx.endUserData.storeFrontId,
        },
      });
      try {
        const order = await Payments.createOrder({
          amount: course.price * 100,
          currency: "INR",
          refrenceId: purchaseData.id,
          endUserId: ctx.endUserData.id,
          storeFrontId: ctx.endUserData.storeFrontId,
          transfers: [
            {
              currency: "INR",
              account:
                store.storeFrontPaymentProcessingDetails.razorpayAccountId,
              amount: merchantCut,
              on_hold: 1,
              //hold of 5 days
              on_hold_until: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5,
            },
          ],
        });
        await ctx.PrismaClient.purchase.update({
          where: {
            id: purchaseData.id,
          },
          data: {
            orderId: order.id,
          },
        });
        return { free: false, order };
      } catch (e) {
        await ctx.PrismaClient.purchase.delete({
          where: {
            id: purchaseData.id,
          },
        });
        console.log(e);
      }
    }),
  verifyPayment: tEndUserProtectedProcedure
    .input(successPaymentCallback)
    .mutation(async ({ ctx, input }) => {
      const genratedPaymentSignature = getPaymentSignature(
        input.razorpay_order_id,
        input.razorpay_payment_id
      );
      // console.log("OrderId", input.razorpay_order_id);
      // console.log("PaymentId", input.razorpay_payment_id);
      // console.log("Genrated Sig", genratedPaymentSignature);
      // console.log("razorpay sig", input.razorpay_signature);
      if (genratedPaymentSignature === input.razorpay_signature) {
        await ctx.PrismaClient.purchase.update({
          where: {
            orderId: input.razorpay_order_id,
          },
          data: {
            paymentId: input.razorpay_payment_id,
            status: "paid",
          },
        });
        return true;
      }
    }),
  paymentStatus: tEndUserProtectedProcedure
    .input(courseId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.purchase.findFirst({
        where: {
          status: "paid",
          coursesId: input.courseId,
          endUserId: ctx.endUserData.id,
        },
      });
    }),
});
