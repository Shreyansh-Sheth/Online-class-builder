import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { TrpcAppRouter } from "@tutor/server";
import backendURL from "../const/backendURL";
import superjson from "superjson";
import { useRecoilState } from "recoil";
import { accessTokenAtom } from "../state/accessTokenAtom";

export const trpc = createTRPCNext<TrpcAppRouter>({
  config({ ctx }) {
    let accessToken: string | null = "";
    if (typeof window !== "undefined") {
      accessToken = window.localStorage.getItem("accessToken");
    }
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          fetch(url, options) {
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                "x-access-token":
                  window.localStorage.getItem("user-token") ?? "",
                Authorization: `Bearer ${
                  window.localStorage.getItem("accessToken") ?? ""
                }`,
              },
              credentials: "include",
            });
          },
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: backendURL.url,
        }),
      ],
      /**
  
      * @link https://react-query-v3.tanstack.com/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
// => { useQuery: ..., useMutation: ...}
