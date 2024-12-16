import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Container,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconBook2,
  IconZoomQuestion,
  IconFileDownload,
  IconNotebook,
  IconVideo,
} from "@tabler/icons";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { useRouter } from "next/router";
import { useCallback, useEffect, useId, useState } from "react";
import { useEffectOnce } from "react-use";
import _ from "underscore";
import { trpc } from "../../../utils/trpc";
import { contentTypes } from "../../../const/contentTypes";
import { SortableItem } from "./SortableItem";

type jsonType = typeof ContentJsonValidator["_input"][number];
export type itemType = jsonType & {
  content: Exclude<
    inferProcedureOutput<TrpcAppRouter["content"]["getContentList"]>,
    null
  >[number];
};
export default function MainDND() {
  const updateJsonDataMutation = trpc.content.updateJson.useMutation();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const [items, setItems] = useState<itemType[]>([]);
  const { courseId } = router.query as { courseId: string };
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((e) => e.id === active.id);

        const newIndex = items.findIndex((e) => e.id === over.id);
        //TODO Make Api Call Here
        const newList = arrayMove(items, oldIndex, newIndex).map((e, idx) => ({
          ...e,
          index: idx,
        }));
        saveState(newList);
        return newList;
      });
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  const {
    data: jsonData,
    isRefetching: jsonDataRefetch,
    isLoading: jsonDataLoading,
  } = trpc.content.getJson.useQuery(
    { courseId: courseId as string },
    { enabled: !!courseId }
  );
  const {
    data: contentList,
    isRefetching: contentListRefetch,
    isLoading: contentListLoading,
  } = trpc.content.getContentList.useQuery(
    { courseId: courseId as string },
    { enabled: !!courseId }
  );

  const [defaultData, setDefaultData] = useState<itemType[]>([]);
  const saveState = (data?: itemType[]) => {
    updateJsonDataMutation.mutate(
      {
        courseId: courseId,
        json: data ?? items,
      },
      {
        onSuccess: () => {
          trpcContext.content.getJson.invalidate({
            courseId: courseId,
          });
          trpcContext.content.getContentList.invalidate({
            courseId: courseId,
          });
        },
      }
    );
  };
  const formatData = useCallback(() => {
    if (!jsonData || !contentList) return;
    const parsedJson = jsonData.json as jsonType[];

    const newContent = parsedJson.map((e, idx) => ({
      content: { ...contentList.find((c) => c.id === e.id)! },
      ...e,
    }));
    return newContent;
  }, [jsonData, contentList]);
  useEffect(() => {
    const newContent = formatData();
    if (!newContent) return;
    setItems(newContent);
  }, [contentList, jsonData, formatData]);
  useEffect(() => {
    const newContent = formatData();
    if (!newContent) return;
    setDefaultData(newContent);
  }, [contentListLoading, formatData, jsonDataLoading]);

  const isOverlayShow = jsonDataRefetch || contentListRefetch;

  return (
    <Paper
      p={"md"}
      sx={{
        overflow: "hidden",
      }}
    >
      <Group mx={5} mb={20} position="apart">
        <Title order={4}>Manage Content</Title>

        {!_(defaultData).isEqual(items) && (
          <Button
            onClick={() => {
              saveState(items);
            }}
          >
            Save
          </Button>
        )}
      </Group>
      <Container sx={{ position: "relative" }}>
        <LoadingOverlay visible={isOverlayShow} overlayBlur={3} />
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Stack>
              {items.map((e, idx) => {
                return <SortableItem key={e.id} {...e} />;
              })}
            </Stack>
          </SortableContext>
        </DndContext>
      </Container>
    </Paper>
  );
}
