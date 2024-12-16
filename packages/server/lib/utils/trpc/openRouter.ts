import * as trpc from "@trpc/server";
import type { Context } from "../trpc/context";
export const OpenRouter = trpc.router<Context>();
