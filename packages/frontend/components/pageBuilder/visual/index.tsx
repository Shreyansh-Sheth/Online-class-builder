import { Center, Group, Paper, Select, Stack } from "@mantine/core";
import { Input } from "@mantine/core";
import { useState } from "react";
import { HeroImageRight } from "../../pageBuilder-dep/components/hero";
import { HeroContentLeft } from "./component/hero";

export default function Visual() {
  const data = {
    hero: {
      title: "hello",
      subtitle: "this is sub title and you have to see it",
      imageUrl: "https://hello.com",
    },
  };
  const [screenWidth, setScreenWidth] = useState(
    screenSizes[0].width.toString()
  );

  return (
    <Stack mt={5}>
      <Paper p={10}>
        <Group>
          <Input.Wrapper label="Screen Size">
            <Select
              value={screenWidth}
              onChange={(e) => setScreenWidth(e?.toString() || "1080")}
              data={screenSizes.map((e) => ({
                value: e.width.toString(),
                label: e.value.toLowerCase(),
              }))}
            />
          </Input.Wrapper>
        </Group>
      </Paper>
      <Center>
        <Paper
          sx={{
            minWidth: screenWidth + "px",
            maxWidth: screenWidth + "px",
            overflow: "scroll",
            minHeight: 1000,
          }}
        >
          <HeroContentLeft
            backgroundImage=""
            subTitle="Hello This Is Subtitle"
            title="ansixjuasbnix xnsajhx"
          />
        </Paper>
      </Center>
    </Stack>
  );
}
const screenSizes = [
  { value: "DESKTOP", width: 1600 / 2 },
  { value: "SMALL-MOBILE", width: 320 },
];
