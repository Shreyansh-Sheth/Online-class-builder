import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import type { AppProps } from "next/app";
import { RouterTransition } from "../components/utils/RouterTransition";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useEffect } from "react";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider, useSession } from "next-auth/react";
import posthog from "posthog-js";
import { useEffectOnce } from "react-use";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  useEffectOnce(() => {
    if (process.env.NODE_ENV === "production") {
      posthog.init("phc_Qh8BjFV1qXaMmtJB8mlycGYY4vE0aZA9wUsQkqPO5iI", {
        api_host: "https://app.posthog.com",
      });
    }
  });
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          if (registration.installing) {
            console.log("Service worker installing");
          } else if (registration.waiting) {
            console.log("Service worker installed");
          } else if (registration.active) {
            console.log("Service worker active");
          }
        } catch (error) {
          console.error(`Registration failed with ${error}`);
        }
      }
    };

    // …
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // const manifestElement = document.getElementById("manifest");
    // if (!manifestElement) return;
    // console.log("manifestElement", manifestElement);
    // if (
    //   window.location.host.split(".").length === 3 ||
    //   process.env.NODE_ENV === "development"
    // ) {
    //   manifestElement.setAttribute("href", "/manifest.webmanifest");
    // } else {
    //   manifestElement.setAttribute("href", "/api/manifest");
    // }
  }, []);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={"light"}
      toggleColorScheme={toggleColorScheme}
    >
      <RecoilRoot>
        <SessionProvider>
          {/* <ReactQueryDevtools /> */}
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme }}
          >
            <AuthSessionProvider>
              <NotificationsProvider>
                <RouterTransition />
                <Component {...pageProps} />
              </NotificationsProvider>
            </AuthSessionProvider>
          </MantineProvider>
        </SessionProvider>
      </RecoilRoot>
    </ColorSchemeProvider>
  );
}

const AuthSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      if (data.user?.email) posthog.identify(data.user?.email);
      //@ts-ignore
      window.localStorage.setItem("user-token", data?.accessToken || "");
    } else {
      window.localStorage.removeItem("user-token");
    }
  }, [status]);
  return <>{children}</>;
};
export default trpc.withTRPC(MyApp);
