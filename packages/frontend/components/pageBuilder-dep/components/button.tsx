import { useNode, Element } from "@craftjs/core";
import { Button, Container, MantineNumberSize, Text } from "@mantine/core";
import { FormEventHandler, useState } from "react";
import TextBuilder from "./text";

export default function BuilderButton({ text }: { text: string }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element id="button" is="div">
      <Button
        ref={(ref: HTMLButtonElement | null) => {
          if (ref) connect(drag(ref));
        }}
      >
        <TextBuilder text={text} />
      </Button>
    </Element>
  );
}
