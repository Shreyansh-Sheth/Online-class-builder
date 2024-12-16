import { Button, Input, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createVideoMetadata } from "@tutor/validation/lib/video";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CourseWrapper from "../../../../../../../components/course/CourseTabBar";
import RteEditor from "../../../../../../../components/utils/RteEditor";
import UploadVideo from "../../../../../../../components/utils/uploadVideo";
import { trpc } from "../../../../../../../utils/trpc";
type AddChapterValidationType = typeof createVideoMetadata["_input"];
function AddChapter() {
  const router = useRouter();
  const { courseId } = router.query;
  const { setValues, getInputProps, onSubmit, setFieldValue } =
    useForm<AddChapterValidationType>({
      validate: zodResolver(createVideoMetadata),
    });
  useEffect(() => {
    if (!courseId) return;
    setFieldValue("courseId", courseId as string);
  }, [courseId]);

  const createVideoMutation = trpc.video.createVideo.useMutation();
  const getVideoUploadUrlMutation = trpc.s3.getFileUploadUrl.useMutation();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    setFieldValue("videoKey", key);
  }, [key]);

  const addNewVideo = onSubmit((data) => {
    // console.log(data);
    createVideoMutation.mutate(
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
  const VideoUploadMemoComp = React.useMemo(
    () => <UploadVideo setKey={setKey} key={key} />,
    [key]
  );

  return (
    <Stack>
      <Paper p={10}>
        <Title order={3}>Add New Video</Title>
      </Paper>

      <Paper p={10}>
        <form onSubmit={addNewVideo}>
          <Stack>
            <TextInput label="Name" required {...getInputProps("name")} />
            <TextInput type="hidden" {...getInputProps("courseId")} />

            <UploadVideo setKey={setKey} />
            <Input.Wrapper label="Info">
              <RteEditor {...getInputProps("description")} />
            </Input.Wrapper>
            <Button loading={createVideoMutation.isLoading} type="submit">
              Add Video
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
