import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import MainHome from "../components/homePages/main";
import StorefrontHome from "../components/homePages/strorefront";
import { InferQueryOutput } from "../utils/types";
import VanillaClient from "../utils/vanillaClient";
import superjson from "superjson";
import { storeFrontId } from "@tutor/validation/lib/storefront";
import { GetStoreAndCourseByHostName } from "../functions/getStoreByHostName";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import StoreNotFound from "../components/homePages/storenotfound";
import { useSession } from "next-auth/react";
export type IndexPropType = {
  store: inferProcedureOutput<TrpcAppRouter["site"]["byDomain"]>;
  course: inferProcedureOutput<
    TrpcAppRouter["endUser"]["course"]["getAllActiveCourse"]
  >;
};
export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  // console.log(context.req.headers);
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};
// type propType = Awaited<ReturnType<typeof getServerSideProps.props>>;
const Home: NextPage<IndexPropType> = ({ store, course }) => {
  // if user loged in redirect to dashboard
  // if (store) {
  //   return <StorefrontHome store={store} course={course} />;
  // }

  if (!store) {
  }
  if (store) {
    return <StorefrontHome store={store} course={course} />;

    // if (store.status === "LIVE") {
    //   return <StorefrontHome store={store} course={course} />;
    // } else {
    //   return <StoreNotFound />;
    // }
  }
  return <MainHome />;
};

export default Home;
