import { z } from "zod";
import { OpenRouter } from "../utils/trpc/openRouter";
import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { pageBuilderSettings } from "@tutor/validation/lib/pagebuilder";

export const PageBuilderRouter = t.router({
  savePageSettings: tProtectedProcedure
    .input(pageBuilderSettings)
    .mutation(async ({ ctx, input }) => {}),
});
export default PageBuilderRouter;
