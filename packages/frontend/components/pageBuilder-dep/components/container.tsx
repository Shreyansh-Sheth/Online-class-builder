// components/user/Container.js
import { useNode } from "@craftjs/core";
import { Paper } from "@mantine/core";
import React from "react";
import TextBuilder from "./text";

export const BuilderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Paper
      ref={(ref: HTMLDivElement) => {
        if (ref) connect(drag(ref));
      }}
      style={{ margin: "5px 0" }}
    >
      {children}
      <TextBuilder text="xasxas" />
    </Paper>
  );
};
