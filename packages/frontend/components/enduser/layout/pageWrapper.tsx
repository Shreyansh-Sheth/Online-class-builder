import { AppShell, createEmotionCache, MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useRefetchCookiesMutation as useRefetchCookiesQuery } from "../../../customQuery/refetch";
import { accessTokenAtom } from "../../../state/accessTokenAtom";
import { trpc } from "../../../utils/trpc";
import { HeaderMegaMenu } from "./navbar";

export default function EndUserPageWrapper({
  iconUrl,
  name,
  children,
  themeColor,
  storeId,
}: {
  iconUrl: string | undefined | null;
  name: string;
  children: React.ReactNode;
  themeColor: string | undefined;
  storeId: string | undefined;
}) {
  // const myCache = createEmotionCache({ key: "enduser" });
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const { data } = trpc.endUser.me.getMe.useQuery(undefined, {
    enabled: !!accessToken,
  });

  //set access token to localstorage
  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem("accessToken", accessToken);
    }
  }, [accessToken]);

  useRefetchCookiesQuery({ storeFrontId: storeId! });

  return (
    <>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        // emotionCache={}
        theme={{
          primaryColor: themeColor,
        }}
      >
        <AppShell
          header={
            <HeaderMegaMenu storeId={storeId} iconUrl={iconUrl} name={name} />
          }
        >
          {children}
        </AppShell>
      </MantineProvider>
    </>
  );
}
