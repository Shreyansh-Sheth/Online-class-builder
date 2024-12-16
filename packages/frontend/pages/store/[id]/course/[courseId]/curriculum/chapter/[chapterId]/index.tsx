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
import { useRouter } from "next/router";
import { useEffect } from "react";
import CourseWrapper from "../../../../../../../../components/course/CourseTabBar";
import { ContentStatusToggle } from "../../../../../../../../components/Curricular/dnd/ContentStatusToggle";
import RteEditor from "../../../../../../../../components/utils/RteEditor";
import { trpc } from "../../../../../../../../utils/trpc";

function ChapterEditor() {
  const router = useRouter();
  const { chapterId } = router.query as { chapterId: string };
  const {
    refetch,
    data: chapterData,
    isLoading,
    isRefetching: chapterDataRefetching,
  } = trpc.chapter.getChapterById.useQuery(
    {
      chapterId,
    },
    {
      enabled: !!chapterId,
    }
  );
  const updateChapterMutation = trpc.chapter.updateChapterById.useMutation();

  const trpcContext = trpc.useContext();

  const { reset, getInputProps, setFieldValue, onSubmit } = useForm<
    typeof updateChapter["_input"]
  >({
    validate: zodResolver(updateChapter),
  });

  const updateChapterSubmit = onSubmit((data) => {
    updateChapterMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  });

  useEffect(() => {
    if (!chapterData || isLoading) return;
    setFieldValue("name", chapterData?.name);
    setFieldValue("description", chapterData?.description ?? undefined);
    setFieldValue("chapterId", chapterId);
  }, [isLoading, chapterData, setFieldValue, chapterId]);
  if (isLoading || !chapterData) {
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
          <Title order={2}>{chapterData?.name}</Title>
          {chapterDataRefetching && <Loader size={"sm"} />}
          {!chapterDataRefetching && (
            <ContentStatusToggle
              refetchFunc={() => {
                trpcContext.chapter.getChapterById.invalidate({
                  chapterId: chapterId,
                });
              }}
              contentId={chapterData.Content?.id!}
              courseId={chapterData.coursesId}
              defaultState={chapterData.Content?.status!}
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
              label="chapter id"
              {...getInputProps("chapterId")}
            />
            <TextInput label="Name" {...getInputProps("name")} />
            <Input.Wrapper label="description">
              <RteEditor {...getInputProps("description")} />
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
