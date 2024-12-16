import { Editor, Element, Frame } from "@craftjs/core";
import {
  ActionIcon,
  AppShell,
  Aside,
  Button,
  Container,
  Header,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { IconAdjustments, IconArrowBack, IconPlus } from "@tabler/icons";
import { useRouter } from "next/router";
import ContentEditable from "react-contenteditable";
import { atom } from "recoil";
import BuilderButton from "./components/button";
import { BuilderContainer } from "./components/container";
import { HeroImageRight } from "./components/hero";
import TextBuilder from "./components/text";
import ThemeProvider from "./components/themeProvider";
import SettingPanel from "./menus/SettingPanel";
import Toolbar from "./menus/Toolbar";

export default function PageBuilderMain() {
  const router = useRouter();
  return (
    <Editor
      resolver={{
        ThemeProvider,
        BuilderContainer,
        Typography: TextBuilder,
        HeroImageRight,
        Paper,
        BuilderButton,
        Button,
        Container,
        Text,
        ContentEditable,
      }}
    >
      <AppShell
        aside={
          <Aside width={{ sm: 200, lg: 400 }} p={5}>
            <Tabs defaultValue="add">
              <Tabs.List>
                <Tabs.Tab icon={<IconPlus size={16} />} value="add">
                  Add
                </Tabs.Tab>
                <Tabs.Tab icon={<IconAdjustments size={16} />} value="settings">
                  Settings
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="settings">
                <SettingPanel />
              </Tabs.Panel>
              <Tabs.Panel value="add">
                <Toolbar />
              </Tabs.Panel>
            </Tabs>
          </Aside>
        }
        header={
          <Header height={70} p="md">
            <Container
              ml={0}
              sx={{ display: "flex", gap: "5px", justifyContent: "start" }}
            >
              <ActionIcon my="auto" variant="filled" onClick={router.back}>
                <IconArrowBack />
              </ActionIcon>
              <Title>Tutor Builder V0.0.1</Title>
            </Container>
          </Header>
        }
      >
        <Frame>
          <ThemeProvider>
            <Element is="div">
              <HeroImageRight />
            </Element>
          </ThemeProvider>
        </Frame>
      </AppShell>
    </Editor>
  );
}
