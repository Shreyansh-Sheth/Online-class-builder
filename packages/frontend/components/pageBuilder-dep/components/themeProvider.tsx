import { Button, DefaultMantineColor, MantineProvider } from "@mantine/core";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { trpc } from "../../../utils/trpc";
import { themeAtom } from "../themeAtom";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [color, setColor] = useRecoilState(themeAtom);

  return (
    <MantineProvider
      withNormalizeCSS
      theme={{
        primaryColor: color,
      }}
    >
      {children}
    </MantineProvider>
  );
}
