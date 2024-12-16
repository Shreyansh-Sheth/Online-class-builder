import { useNode, Element } from "@craftjs/core";
import { Container, NumberInput, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { GlobalComponentTypes, TextPropsType } from "../types";
interface propType extends TextPropsType {
  text: string;
}

export default function TextBuilder({ text, className, sx }: propType) {
  const {
    hasSelectedNode,
    hasDraggedNode,
    isActive,
    connectors: { connect, drag },
    actions: { setProp, setHidden },
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasDraggedNode: state.events.dragged,
    isActive: state.events.selected,
  }));
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    !hasSelectedNode && setEditable(false);
  }, [hasSelectedNode]);

  return (
    <Element id="textcdscds" is="div">
      <Text
        className={className}
        sx={sx}
        ref={(ref: HTMLDivElement | null) => {
          if (ref) connect(drag(ref));
        }}
        onClick={() => setEditable(true)}
      >
        <ContentEditable
          html={text}
          tagName={"span"}
          disabled={!editable}
          onChange={(e) =>
            setProp(
              (props: propType) =>
                (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""))
            )
          }
        />
      </Text>
    </Element>
  );
}

export const TextSettings = () => {
  const {
    actions: { setProp },
    text,
    sx,
  } = useNode<propType>((node) => ({
    sx: node.data.props.sx,
    text: node.data.props.text,
  }));
  // return <Container></Container>;
  return (
    <Container>
      <NumberInput
        label="Font Size"
        value={Number(sx?.fontSize ?? 16)}
        onChange={(e) => {
          setProp((props: propType) => {
            // props?.sx?.fontSize = e ?? 16;
            //@ts-ignore
            props.sx = { ...props.sx, fontSize: e ?? 16 };
          });
        }}
      />
      <Select
        value={sx?.fontWeight?.toString() ?? "normal"}
        onChange={(e) => {
          setProp((props: propType) => {
            //@ts-ignore
            props.sx = { ...props.sx, fontWeight: e ?? "normal" };
            // props.sx.fontWeight = e ?? "normal";
          });
        }}
        data={[
          { value: "normal", label: "Normal" },
          { value: "bolder", label: "Bold" },
          { value: "lighter", label: "Light" },
        ]}
      />
    </Container>
  );
};

TextBuilder.craft = {
  related: {
    // mainSett ings: GlobalSettings,
    settings: TextSettings,
  },
};
