import { useEditor } from "@craftjs/core";
import { Button, Divider, Stack, Text } from "@mantine/core";
import { HeroImageRight } from "../components/hero";
import Typography from "../components/text";

export default function Toolbar() {
  const { connectors, query } = useEditor();
  return (
    <Stack>
      <Text>Drag To Add Contents</Text>
      <Divider />

      <Button
        ref={(ref: HTMLButtonElement | null) => {
          if (ref) connectors.create(ref, <HeroImageRight />);
        }}
      >
        Hero 1
      </Button>
    </Stack>
  );
}
