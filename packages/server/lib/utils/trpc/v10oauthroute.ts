import { TRPCError } from "@trpc/server";
import { t } from "./v10";

// export const tOauthProcedure = t.procedure.use(
//   t.middleware(({ input, ctx, next }) => {
//     const newIn = input as { oauthSecret?: string } | undefined;
//     console.log(process.env.END_USER_OAUTH_SECRET);
//     console.dir(input);

//     if (
//       !newIn ||
//       !newIn?.oauthSecret ||
//       newIn.oauthSecret !== process.env.END_USER_OAUTH_SECRET
//     ) {
//       console.log("here");
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }
//     return next({
//       ctx: ctx,
//     });
//   })
// );

export const checkEndUserOauth = (secret: string) => {
  if (secret !== process.env.END_USER_OAUTH_SECRET) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};
