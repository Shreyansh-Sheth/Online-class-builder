import {
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Switch,
  Title,
  TextInput,
  Input,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { updateChapter } from "@tutor/validation/lib/chapter";
import { updateNote } from "@tutor/validation/lib/notes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseWrapper from "../../../../../../../../components/course/CourseTabBar";
import { ContentStatusToggle } from "../../../../../../../../components/Curricular/dnd/ContentStatusToggle";
import RteEditor from "../../../../../../../../components/utils/RteEditor";
import { trpc } from "../../../../../../../../utils/trpc";

function ChapterEditor() {
  const router = useRouter();
  const { noteId } = router.query as { noteId: string };
  const {
    refetch,
    data: noteData,
    isLoading,
    isRefetching: noteDataRefetching,
  } = trpc.note.getNotesById.useQuery(
    {
      noteId,
    },
    {
      enabled: !!noteId,
    }
  );
  const updateChapterMutation = trpc.note.updateNotesById.useMutation();

  const trpcContext = trpc.useContext();

  const { getInputProps, setFieldValue, onSubmit } = useForm<
    typeof updateNote["_input"]
  >({
    validate: zodResolver(updateNote),
  });

  const updateChapterSubmit = onSubmit((data) => {
    //TODO fix this
    updateChapterMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  });
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);

  useEffect(() => {
    if (!noteData || isLoading) return;
    setFieldValue("name", noteData?.name);
    setFieldValue("note", noteData?.note);
    setFieldValue("noteId", noteId);
    //TODO get data from past url list to show up here
    setFieldValue("urlList", imageUrlList);
  }, [isLoading, noteData, noteId]);
  if (isLoading || !noteData) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack>
      <Paper p={10}>
        <Group position="apart">
          <Title order={2}>{noteData?.name}</Title>
          {noteDataRefetching && <Loader size={"sm"} />}
          {!noteDataRefetching && (
            <ContentStatusToggle
              contentId={noteData.Content?.id!}
              courseId={noteData.coursesId}
              defaultState={noteData.Content?.status!}
            />
          )}
        </Group>
      </Paper>
      <Paper p={10}>
        <Title order={3} mb={10}>
          Edit
        </Title>
        <form onSubmit={updateChapterSubmit}>
          <Stack sx={{ position: "relative" }}>
            <LoadingOverlay visible={updateChapterMutation.isLoading} />
            <TextInput
              type="text"
              disabled
              label="Note id"
              {...getInputProps("noteId")}
            />
            <TextInput label="Name" {...getInputProps("name")} />
            <Input.Wrapper label="Description">
              <RteEditor setUrl={setImageUrlList} {...getInputProps("note")} />
            </Input.Wrapper>
            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
export default function AddChapterWrapper() {
  return (
    <CourseWrapper>
      <ChapterEditor />
    </CourseWrapper>
  );
}
