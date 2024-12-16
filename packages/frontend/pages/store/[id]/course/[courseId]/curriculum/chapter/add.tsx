import { Button, Input, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { addChapter } from "@tutor/validation/lib/chapter";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import CourseWrapper from "../../../../../../../components/course/CourseTabBar";
import RichText from "../../../../../../../components/utils/RichText";
import RteEditor from "../../../../../../../components/utils/RteEditor";
import RteControls from "../../../../../../../const/rteControls";
import { trpc } from "../../../../../../../utils/trpc";
type AddChapterValidationType = typeof addChapter["_input"];
function AddChapter() {
  const router = useRouter();
  const { courseId } = router.query;
  const { setValues, getInputProps, onSubmit, setFieldValue } =
    useForm<AddChapterValidationType>({
      validate: zodResolver(addChapter),
      initialValues: {
        name: "",
        courseId: "",
        description: "",
      },
    });
  useEffect(() => {
    if (!courseId) return;
    setFieldValue("courseId", courseId as string);
  }, [courseId]);

  const addChapterMutation = trpc.chapter.addChapter.useMutation();
  const getImageUploadUrlMutation = trpc.s3.getFileUploadUrl.useMutation();

  const addNewChapter = onSubmit((data) => {
    // console.log(data);
    addChapterMutation.mutate(
      {
        ...data,
        courseId: courseId as string,
      },
      {
        onSuccess() {
          router.back();
        },
      }
    );
  });
  return (
    <Stack>
      <Paper p={10}>
        <Title order={3}>Add New Chapter</Title>
      </Paper>

      <Paper p={10}>
        <form onSubmit={addNewChapter}>
          <Stack>
            <TextInput label="Name" required {...getInputProps("name")} />
            <TextInput type="hidden" {...getInputProps("courseId")} />
            <Input.Wrapper label="Info">
              <RteEditor {...getInputProps("description")} />
            </Input.Wrapper>
            <Button type="submit" loading={addChapterMutation.isLoading}>
              Add Chapter
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default function AddChapterWrapper() {
  return (
    <CourseWrapper>
      <AddChapter />
    </CourseWrapper>
  );
}
