import { z } from "zod";
import { OpenRouter } from "../utils/trpc/openRouter";
import { t } from "../utils/trpc/v10";

export const SiteRouter = t.router({
  byDomain: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    const storefront = await ctx.cachePrismaClient.storeFront.findFirst({
      include: {
        Domain: true,
        theme: true,
        iconUrl: true,
      },
      where: {
        Domain: {
          some: {
            name: input,
          },
        },
      },
    });
    // console.log(storefront, "Storefront");
    return storefront;
  }),
});
export default SiteRouter;
