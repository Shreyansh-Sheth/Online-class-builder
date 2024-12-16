import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { tProtected } from "./v10ProtectedRouter";
import superjson from "superjson";
import { AxiomClient } from "../axiom";

const baseT = initTRPC.context<Context>().create({
  transformer: superjson,
});

const logger = baseT.middleware(
  async ({ ctx, input, meta, next, path, rawInput, type }) => {
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    return result;

    AxiomClient.datasets.ingestEvents("trpc", [
      { input, meta, path, rawInput, type },
    ]);
    return result;
  }
);
// export const t = baseT.procedure.use(logger);
export const t = baseT;
