// pages/index.tsx
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { TrpcAppRouter } from "@tutor/server";
import backendURL from "../const/backendURL";
import superjson from "superjson";
const VanillaClient = createTRPCProxyClient<TrpcAppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: backendURL.url,

      fetch(url, options) {
        return fetch(url, {
          ...options,

          credentials: "include",
        });
      },
    }),
  ],
});
export default VanillaClient;
