import { t } from "../../utils/trpc/v10";
import { tAdminProcedure } from "../../utils/trpc/v10AdminRouter";
import { storeFrontAdminRouter } from "./storefront";
import { UsersAdminRouter } from "./user";

export const AdminRouter = t.router({
  checkAdmin: tAdminProcedure.mutation(() => "Hello From Admin"),
  user: UsersAdminRouter,
  storefront: storeFrontAdminRouter,
});
