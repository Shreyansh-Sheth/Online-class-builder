import { t } from "../../utils/trpc/v10";
import { authRouter } from "./auth";
import { courseRouter } from "./course";
import { meRoute } from "./me";
import { oauthRouter } from "./oauth";
import { ForgotPasswordRouter } from "./forgot";
import { endUserPaymentRouter } from "./payment";
import { contentRouter } from "./content";
const endUserRouter = t.router({
  course: courseRouter,
  register: authRouter,
  oauth: oauthRouter,
  me: meRoute,
  forgot: ForgotPasswordRouter,
  payment: endUserPaymentRouter,
  content: contentRouter,
});
export default endUserRouter;
