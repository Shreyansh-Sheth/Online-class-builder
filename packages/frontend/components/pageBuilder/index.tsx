import { Center, Paper, Tabs } from "@mantine/core";
import Data from "./data";
import Visual from "./visual";

export default function PageBuilder() {
  return (
    <Tabs variant="pills" color={"violet"} defaultValue={"visual"}>
      <Paper p={10}>
        <Center>
          <Tabs.List>
            <Tabs.Tab defaultChecked value="visual">
              Visual
            </Tabs.Tab>
            <Tabs.Tab value="data">Data</Tabs.Tab>
          </Tabs.List>
        </Center>
      </Paper>

      <Tabs.Panel value="visual">
        <Visual />
      </Tabs.Panel>
      <Tabs.Panel value="data">
        <Data />
      </Tabs.Panel>
    </Tabs>
  );
}
