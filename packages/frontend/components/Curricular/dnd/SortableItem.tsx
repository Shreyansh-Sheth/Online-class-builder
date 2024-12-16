import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconExternalLink, IconGripVertical } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { contentTypes, IconsFromTypes } from "../../../const/contentTypes";
import { itemType } from "./main";

export function SortableItem(props: itemType) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });
  const router = useRouter();
  const { id } = router.query;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [hide, setHide] = useState(true);
  const ContentTypeBadge = (
    <Badge size="sm" color={IconsFromTypes[props.content.type].color}>
      {props.content.type === "DOWNLOADABLE" ? "DOWNLOAD" : props.content.type}
    </Badge>
  );
  return (
    <Paper
      shadow={isDragging ? "md" : "xs"}
      p={"xs"}
      ml={props.content.type !== contentTypes.CHAPTER ? "md" : 0}
      ref={setNodeRef}
      sx={(theme) => ({
        zIndex: isDragging ? 10 : 0,
        backgroundColor: `${
          props.content.status === "DISABLE"
            ? theme.colorScheme !== "dark"
              ? theme.colors.gray[1]
              : theme.colors.gray[9]
            : "auto"
        }`,
      })}
      withBorder
      style={style}
      {...attributes}
      aria-describedby={`DndContext-${props.id}`}
    >
      <Stack>
        <Group position="apart">
          <Group>
            <ActionIcon
              color={"blue"}
              sx={{
                touchAction: "none",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              {...listeners}
              // onClick={(e: { preventDefault: () => {} }) => {
              //   console.log("sanxjsainjxinsaj");
              //   if (e && e?.preventDefault) e.preventDefault();
              //   // listeners.onClick(e);
              // }}
            >
              <IconGripVertical
                onClick={(e) => {
                  e.preventDefault();
                }}
                size={12}
              />
            </ActionIcon>

            <ActionIcon
              component={Link}
              href={getEditLinkFromData({
                ...props,
                storeId: id as string,
              })}
              color="gray"
            >
              <IconExternalLink size={14} />
            </ActionIcon>
            {/* <Tooltip label={props.content.type.toLocaleLowerCase()}>
              <ThemeIcon
                variant="outline"
                color={IconsFromTypes[props.content.type].color}
              >
                {IconsFromTypes[props.content.type].icon}
              </ThemeIcon>
            </Tooltip> */}
          </Group>
          <Group spacing={2}>
            {ContentTypeBadge}
            {/* <ContentStatusToggle
              defaultState={props.content.status}
              contentId={props.content.id}
              courseId={props.content.coursesId}
            />
            <DemoStatusToggle
              contentId={props.content.id}
              courseId={props.content.coursesId}
              defaultState={props.content.isDemo}
            /> */}
          </Group>
        </Group>
        <Divider />
        <Box
          mx={"md"}
          p={"sm"}
          sx={{
            borderRadius: "10px",
          }}
        >
          <Text weight={600} lineClamp={1} component="a">
            {getNameFromData(props)}{" "}
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
}

const getEditLinkFromData = (props: itemType & { storeId: string }) => {
  const origin = window.location.origin;
  if (props.content.type === "CHAPTER") {
    return `${origin}/store/${props.storeId}/course/${props.content.coursesId}/curriculum/chapter/${props.content.chapter?.id}`;
  }
  if (props.content.type === "NOTES") {
    return `${origin}/store/${props.storeId}/course/${props.content.coursesId}/curriculum/note/${props.content.notesId}`;
  }
  if (props.content.type === "DOWNLOADABLE") {
    return `${origin}/store/${props.storeId}/course/${props.content.coursesId}/curriculum/downloadable/${props.content.downloadableId}`;
  }
  if (props.content.type === "VIDEO") {
    return `${origin}/store/${props.storeId}/course/${props.content.coursesId}/curriculum/video/${props.content.videoId}`;
  }

  return "";
};

export const getNameFromData = (prop: itemType) => {
  if (prop.content.chapter) {
    return prop.content.chapter.name;
  }
  if (prop.content.notes) {
    return prop.content.notes.name;
  }
  if (prop.content.downloadable) {
    return prop.content.downloadable.name;
  }
  if (prop.content.video) {
    return prop.content.video.name;
  }

  return "";
};
