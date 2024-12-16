import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import { RecoilRoot } from "recoil";
import Router from "./Routes";
import TrpcProvider from "./utils/trpc-provider";

function App() {
  return (
    <TrpcProvider>
      <RecoilRoot>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Router />
        </MantineProvider>
      </RecoilRoot>
    </TrpcProvider>
  );
}

export default App;
