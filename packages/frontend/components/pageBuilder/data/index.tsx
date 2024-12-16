import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  DndContext,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ActionIcon, Container, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  IconEdit,
  IconGripVertical,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons";
import { sections } from "./componentList";
import SortableItem from "./sortable";

export default function Data() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );
  const [ids, setIds] = useState(sections.map((e) => e.name));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id !== over.id) {
      const isSwitchable = sections
        .filter((e) => !e.draggable)
        .find((e) => e.name === active.id || e.name === over.id);

      if (isSwitchable) {
        return;
      }
      setIds((items) => {
        const oldIndex = items.findIndex((e) => e === active.id);

        const newIndex = items.findIndex((e) => e === over.id);
        //TODO Make Api Call Here
        const newList = arrayMove(items, oldIndex, newIndex);
        setIds(newList);
        return newList;
      });
    }
  }
  return (
    <Container mt={10}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <Stack spacing={"md"}>
            {ids.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </Container>
  );
}

const HeroSectionData = ({ id }: { id: string }) => {};
