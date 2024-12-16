// utils/trpc.ts
import { createTRPCReact } from "@trpc/react-query";

import type { TrpcAppRouter } from "@tutor/server";
import { httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
export const trpc = createTRPCReact<TrpcAppRouter>();
export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      fetch(url, options) {
        let accessToken: string | null = "";
        if (typeof window !== "undefined") {
          accessToken = window.sessionStorage.getItem("token");
        }
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            "x-admin-secret": `${accessToken}`,
          },
          credentials: "include",
        });
      },
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @link https://trpc.io/docs/ssr
       **/
      url: import.meta.env.DEV
        ? "http://localhost:4000/trpc"
        : "https://backend.skillflake.com/trpc",
    }),
  ],
});

// export const trpc = createTRPCReact<TrpcAppRouter>({
//   config({ ctx }) {
//     return {
//       transformer: SuperJSON,
//       links: [
//         httpBatchLink({
//           fetch(url, options) {
//             let accessToken: string | null = "";
//             if (typeof window !== "undefined") {
//               accessToken = window.sessionStorage.getItem("token");
//             }
//             return fetch(url, {
//               ...options,
//               headers: {
//                 ...options?.headers,
//                 Authorization: `${
//                   window.localStorage.getItem("accessToken") ?? ""
//                 }`,
//               },
//               credentials: "include",
//             });
//           },
//           /**
//            * If you want to use SSR, you need to use the server's full URL
//            * @link https://trpc.io/docs/ssr
//            **/
//           url: process.env.BACKEND_URL || "http://localhost:4000/trpc",
//         }),
//       ],
//       /**

//         * @link https://react-query-v3.tanstack.com/reference/QueryClient
//          **/
//       // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
//     };
//   },

//   /**
//    * @link https://trpc.io/docs/ssr
//    **/
//   ssr: false,
// });
