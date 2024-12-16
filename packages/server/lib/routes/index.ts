import * as trpc from "@trpc/server";
import { Context } from "../utils/trpc/context";
import { t } from "../utils/trpc/v10";
import authRouter from "./auth";
import CourseRouter from "./courseAdmin";
import domainRouter from "./domain";
import s3Router from "./s3";
import SiteRouter from "./site";
import StoreFrontRouter from "./storeFront";
import themeRouter from "./theme";
import userRouter from "./user";
import chapterRouter from "./chapterAdmin";
import { ContentRouter } from "./content";
import noteRouter from "./notes";
import downloadableRouter from "./donwloadable";
import endUserRouter from "./endUser";
import { endUserManageRoute } from "./enduserManagment";
import { videoRouter } from "./video";
import statsRouter from "./stats";
import { AdminRouter } from "./admin";
import { kycRouter } from "./kyc";
import { AxiomClient } from "../utils/axiom";

const legacyRouter = trpc
  .router<Context>()
  // .merge("auth.", AuthRouter)
  // .merge("site.", SiteRouter)
  // .merge("user.", UserRouter)
  // .merge("storefront.", StoreFrontRouter)
  // .merge("domain.", DomainRouter)
  // .merge("theme.", ThemeRouter)
  // .merge("s3.", s3Router)
  // .merge("course.", CourseRouter)
  .interop();

const mainRouter = t.router({
  v10: t.procedure.query(() => "Hello From v10"),
  admin: AdminRouter,
  auth: authRouter,
  site: SiteRouter,
  user: userRouter,
  kyc: kycRouter,
  storefront: StoreFrontRouter,
  domain: domainRouter,
  theme: themeRouter,
  s3: s3Router,
  course: CourseRouter,
  chapter: chapterRouter,
  content: ContentRouter,
  note: noteRouter,
  downloadable: downloadableRouter,
  endUser: endUserRouter,
  endUserManagement: endUserManageRoute,
  video: videoRouter,
  stats: statsRouter,
});

const appRouter = t.mergeRouters(legacyRouter, mainRouter);

export default appRouter;
// export type definition of API
export type AppRouter = typeof appRouter;
