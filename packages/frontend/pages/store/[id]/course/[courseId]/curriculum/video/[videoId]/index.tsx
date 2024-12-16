import {
  Button,
  Input,
  Paper,
  Stack,
  TextInput,
  Title,
  Group,
  Loader,
  Badge,
  AspectRatio,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  createVideoMetadata,
  updateVideoMetadata,
} from "@tutor/validation/lib/video";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CourseWrapper from "../../../../../../../../components/course/CourseTabBar";
import RteEditor from "../../../../../../../../components/utils/RteEditor";
import UploadVideo from "../../../../../../../../components/utils/uploadVideo";
import { ContentStatusToggle } from "../../../../../../../../components/Curricular/dnd/ContentStatusToggle";
import { trpc } from "../../../../../../../../utils/trpc";
type updateChapterValidation = typeof updateVideoMetadata["_input"];
function AddChapter() {
  const router = useRouter();
  const { courseId, videoId } = router.query as {
    courseId: string;
    videoId: string;
  };
  const { setValues, getInputProps, onSubmit, setFieldValue } =
    useForm<updateChapterValidation>({
      validate: zodResolver(createVideoMetadata),
    });
  useEffect(() => {
    if (!courseId) return;
    setFieldValue("courseId", courseId as string);
  }, [courseId]);

  const updateVideoMutaion = trpc.video.updateVideo.useMutation();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    setFieldValue("videoKey", key);
  }, [key]);

  const updateVideo = onSubmit((data) => {
    updateVideoMutaion.mutate(
      {
        ...data,
      },
      {
        onSuccess() {
          router.back();
        },
      }
    );
  });
  const { data: videoData, isRefetching: videoDataRefetching } =
    trpc.video.getVideoData.useQuery(
      { videoId: videoId },
      {
        enabled: !!videoId,
        onSuccess(data) {
          setFieldValue("name", data.name);
          setFieldValue(
            "description",
            data.description ? data.description : undefined
          );
          setFieldValue("videoKey", data.fileKey);
          setFieldValue("videoId", data.id);
        },
      }
    );
  const [streamURL, setStreamUrl] = useState<string | null>(null);
  const signedVideoUrlMutation =
    trpc.video.getVideoStreamSignedUrl.useMutation();
  return (
    <Stack>
      <Paper p={10}>
        <Group position="apart">
          <Title order={2}>{videoData?.name}</Title>
          <Group>
            <Badge
              color={
                videoData?.StreamStatus === "ERROR"
                  ? "red"
                  : videoData?.StreamStatus === "READY_TO_STREAM"
                  ? "green"
                  : "yellow"
              }
            >
              {videoData?.StreamStatus}
            </Badge>
            {videoDataRefetching && <Loader size={"sm"} />}
            {!videoDataRefetching && (
              <ContentStatusToggle
                contentId={videoData?.Content?.id! ?? ""}
                courseId={videoData?.coursesId ?? ""}
                defaultState={videoData?.Content?.status!}
              />
            )}
          </Group>
        </Group>
      </Paper>
      <Paper p={10}>
        <Title order={3}>Watch Video</Title>
        <Center>
          <AspectRatio
            ratio={16 / 9}
            sx={{
              "@media (max-width: 768px)": {
                width: "100%",
              },

              width: "60%",
            }}
          >
            {signedVideoUrlMutation.isSuccess ? (
              <iframe
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                // style="border: none; position: absolute; top: 0; height: 100%; width: 100%"

                style={{
                  border: "none",
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  width: "100%",
                }}
                allowFullScreen={true}
                width={"100%"}
                height={"100%"}
                src={signedVideoUrlMutation?.data ?? ""}
              ></iframe>
            ) : (
              <Center
                sx={{
                  backgroundColor: "gray",
                }}
              >
                <Button
                  disabled={videoData?.StreamStatus !== "READY_TO_STREAM"}
                  onClick={() => {
                    signedVideoUrlMutation.mutate({
                      videoId: videoId,
                    });
                  }}
                  loading={signedVideoUrlMutation.isLoading}
                  color={
                    videoData?.StreamStatus === "READY_TO_STREAM"
                      ? "blue"
                      : "gray"
                  }
                >
                  {videoData?.StreamStatus === "READY_TO_STREAM"
                    ? "Watch Video"
                    : "Video is not ready to stream"}
                </Button>
              </Center>
            )}
          </AspectRatio>
        </Center>
      </Paper>
      <Paper p={10}>
        <Title order={3} mb={10}>
          Edit
        </Title>
        <form onSubmit={updateVideo}>
          <Stack>
            <TextInput
              disabled
              label="Video Id"
              {...getInputProps("videoId")}
            />
            <TextInput label="Name" required {...getInputProps("name")} />

            <UploadVideo setKey={setKey} label="Update To New Video" />
            <Input.Wrapper label="Info">
              <RteEditor {...getInputProps("description")} />
            </Input.Wrapper>
            <Button type="submit" loading={updateVideoMutaion.isLoading}>
              Update Video{" "}
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
