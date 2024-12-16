import { useNode } from "@craftjs/core";
import { Container, NativeSelect, NumberInput } from "@mantine/core";
import { GlobalComponentTypes } from "../types";

export default function GlobalSettings() {
  const {
    actions: { setProp },
    display,
  } = useNode<GlobalComponentTypes>((node) => ({
    display: node.data.props.display,
  }));

  return (
    <Container>
      <NativeSelect
        data={[
          "inline",
          "block",
          "flex",
          "none",
          "grid",
          "inline-block",
          "inline-flex",
          "table",
          "table-row",
          "list-item",
          "inherit",
          "initial",
          "revert",
        ]}
        value={display as string}
        onChange={(e) => {
          setProp((props: GlobalComponentTypes) => {
            props.display = (e.target.value ??
              "block") as GlobalComponentTypes["display"];
          });
        }}
      />
    </Container>
  );
}
