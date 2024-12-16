import { Button, Container, Divider, Select, Title } from "@mantine/core";
import { useEditor } from "@craftjs/core";
import React from "react";
import { Text } from "@mantine/core";
import { themeAtom } from "../themeAtom";
import { useRecoilState } from "recoil";
import Theme from "../../setting/theme";

export default function SettingPanel() {
  const { actions, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        isDeletable: query.node(currentNodeId).isDeletable(),
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        mainSettings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.mainSettings,
      };
    }

    return {
      selected,
    };
  });
  const [theme, setThemeAtom] = useRecoilState(themeAtom);

  return (
    <Container>
      <Title order={3}>Component Settings</Title>

      <Divider my={5} />
      <Theme
        setTheme={(v) => {
          setThemeAtom(v);
        }}
      />
      <Divider />
      {selected && (
        <>
          <Text>{selected.name}</Text>
          <Divider my={5} />
          {selected.mainSettings && React.createElement(selected.mainSettings)}
          {selected.settings && React.createElement(selected.settings)}
          {selected.isDeletable && (
            <>
              <Divider my={5} />
              <Button
                color="red"
                onClick={() => {
                  actions.delete(selected.id);
                }}
              >
                Delete
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
}
