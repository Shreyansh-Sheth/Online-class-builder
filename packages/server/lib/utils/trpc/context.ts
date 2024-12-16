import p from "@tutor/db";
const { Prisma } = p;

import * as trpc from "@trpc/server";
import { inferProcedureOutput } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { addDays, parseISO } from "date-fns";
import { verify } from "jsonwebtoken";
import { AuthToken } from "../../jwt/auth";
import { TrpcAppRouter } from "../../server";
import { prismaClient } from "../prisma/client";
import { cachePrismaClient } from "../prisma/prismaCacheClient";
type endUserType = Omit<p.EndUser, "password">;

// The app's context - is generated for each incoming request
export async function createContext({ req, res }: CreateExpressContextOptions) {
  const PrismaClient = prismaClient;

  const authCookie = req.headers["x-access-token"];
  // console.log(authCookie);

  let userData = undefined;
  try {
    userData = AuthToken.verifyToken(authCookie as string) as {
      id: string;
      email: string;
      name: string;
      refetchTime: string;
    };

    // console.log("USER", userData);
  } catch {}

  let endUserData = undefined;
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
    if (!accessToken) throw new Error("No access token");
    endUserData = verify(accessToken, ACCESS_TOKEN_SECRET) as endUserType;
  } catch {}

  return {
    PrismaClient,
    req,
    res,
    userData,
    cachePrismaClient,
    endUserData,
  };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
