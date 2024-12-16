import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { AppRouter } from "./routes";
import Router from "./routes";
import cors from "cors";
import { createContext } from "./utils/trpc/context";
import { SendMail } from "./email/sendEmail";
import cookieParser from "cookie-parser";
import { S3Service } from "./utils/s3";
import CloudflareRouter, { setWebhook } from "./webhooks/cfStream";
import * as Sentry from "@sentry/node";
import { RazorPayWebhookRouter } from "./webhooks/razorpay";

const app = express();
Sentry.init({
  dsn: "https://65d123a489074f878cc00641c58cf713@o4504043057053696.ingest.sentry.io/4504254972428288",
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// const corsOptions = { o, credentials: true };
app.use(
  cors({
    origin(requestOrigin, callback) {
      callback(null, requestOrigin);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: Router,
    createContext,
  })
);

//do this before running
S3Service.setCors();
setWebhook();
app.use("/webhook/cloudflare", CloudflareRouter);
app.use("/razorpay", RazorPayWebhookRouter);
app.listen(4000, () => {
  console.log("Server Is Running");
});
export type TrpcAppRouter = AppRouter;
