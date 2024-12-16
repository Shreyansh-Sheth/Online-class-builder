//ignore whole file for ts
// @ts-nocheck
import { TRPCError } from "@trpc/server";
import { register } from "@tutor/validation";
import { login, verify } from "@tutor/validation/lib/auth";
import SendLoginEmail from "../email/loginEmail";
import SendRegisterEmail from "../email/registerEmail";
import { AuthToken } from "../jwt/auth";
import { VerifyJWT } from "../jwt/verification";
import { cookieOptions } from "../utils/cookieOptions";
import { OpenRouter } from "../utils/trpc/openRouter";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";

const authRouter = t.router({
  hello: t.procedure.query(async ({ ctx, input }) => {
    return "hello world";
  }),
  register: t.procedure.input(register).mutation(async ({ ctx, input }) => {
    const user = await ctx.PrismaClient.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (user?.isEmailVerified) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User Already Exist. Please Try To Login",
      });
    }
    await ctx.PrismaClient.user.upsert({
      create: {
        name: input.name,
        email: input.email,
      },
      where: {
        email: input.email,
      },
      update: {
        name: input.name,
      },
    });
    SendRegisterEmail(input.email, false);
  }),
  login: t.procedure.input(login).mutation(async ({ ctx, input }) => {
    const user = await ctx.PrismaClient.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You Dont Have An Account Please Create One",
      });
    }
    SendLoginEmail(input.email, user.isEmailVerified);
  }),
  logout: t.procedure.mutation(async ({ ctx, input }) => {
    ctx.res.clearCookie("token", cookieOptions);
  }),
  verify: t.procedure.input(verify).mutation(async ({ ctx, input }) => {
    const tokenData = VerifyJWT.verifyToken(input.token) as {
      email: string;
      isVerified: string;
    };
    // console.log(tokenData);
    if (!tokenData.email) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    if (!tokenData.isVerified) {
      await ctx.PrismaClient.user.update({
        where: {
          email: tokenData.email,
        },
        data: {
          isEmailVerified: true,
        },
      });
    }
    const user = await ctx.PrismaClient.user.findUniqueOrThrow({
      where: {
        email: tokenData.email,
      },
    });

    const token = AuthToken.getToken(user);
    ctx.res.cookie("token", token, cookieOptions);
  }),
});

export default authRouter;
