import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Group, Paper, Stack, Title } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import { sections } from "./componentList";

export default function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const sectionData = sections.find((e) => e.name === id);

  return (
    <Paper p={10} ref={setNodeRef} style={style} {...attributes}>
      <Stack>
        <Group position="apart">
          <ActionIcon
            disabled={!sectionData?.draggable}
            color={sectionData?.draggable ? "blue" : "gray"}
            sx={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            {...(sectionData?.draggable ? listeners : {})}
          >
            <IconGripVertical size={18} />
          </ActionIcon>
          <Title order={4}>{sectionData?.name}</Title>
        </Group>
        <Paper>{sectionData?.component}</Paper>
      </Stack>
    </Paper>
  );
}
