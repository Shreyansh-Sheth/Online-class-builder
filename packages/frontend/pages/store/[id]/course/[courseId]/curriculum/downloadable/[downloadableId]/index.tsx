import {
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Switch,
  Title,
  Text,
  TextInput,
  Input,
  Button,
  LoadingOverlay,
  ActionIcon,
  SimpleGrid,
  Overlay,
  RingProgress,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { updateChapter } from "@tutor/validation/lib/chapter";
import { updateDownloadableName } from "@tutor/validation/lib/downloadable";
import { filesize } from "filesize";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseWrapper from "../../../../../../../../components/course/CourseTabBar";
import { ContentStatusToggle } from "../../../../../../../../components/Curricular/dnd/ContentStatusToggle";
import RteEditor from "../../../../../../../../components/utils/RteEditor";
import { trpc } from "../../../../../../../../utils/trpc";
import {
  IconPhoto,
  IconUpload,
  IconX,
  IconFile,
  IconTrashX,
} from "@tabler/icons";
import { FileDownloadableManager } from "../../../../../../../../components/utils/FileDownloadableManager";
import { FileWithPath } from "@mantine/dropzone";
import axios from "axios";

function DownloadableEditor() {
  const router = useRouter();
  const { downloadableId } = router.query as { downloadableId: string };
  const {
    refetch,
    data: downloadableData,
    isLoading,
    isRefetching: downloadableDataRefetching,
  } = trpc.downloadable.getDownloadableById.useQuery(
    {
      downloadableId,
    },
    {
      enabled: !!downloadableId,
    }
  );
  const updateDownloadableMutation = trpc.downloadable.updateName.useMutation();

  const trpcContext = trpc.useContext();

  const { reset, getInputProps, setFieldValue, onSubmit } = useForm<
    typeof updateDownloadableName["_input"]
  >({
    validate: zodResolver(updateDownloadableName),
  });

  const updateChapterSubmit = onSubmit((data) => {
    updateDownloadableMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  });

  useEffect(() => {
    if (!downloadableData || isLoading) return;
    setFieldValue("name", downloadableData?.name);
    setFieldValue("downloadableId", downloadableId);
  }, [isLoading, downloadableData, setFieldValue, downloadableId]);

  //For adding Files
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const updateDownloadableFileMutation =
    trpc.downloadable.updateDownloadableFile.useMutation();
  const uploadAndAddFilesToDownloadable = async () => {
    if (files.length === 0) return;
    setIsSubmitting(true);

    try {
      const allKeys = (
        await Promise.all(
          files.map(async (e, idx) => {
            return {
              mime: e.type,
              size: e.size,
              key: await uploadFileWithIndex(idx),
              name: e.name,
            };
          })
        )
      ).filter((e) => typeof e.key === "string");
      await updateDownloadableFileMutation.mutateAsync(
        {
          downloadableId: downloadableId,
          fileList: allKeys,
        },
        {
          onSuccess: () => {
            trpcContext.downloadable.getDownloadableById.refetch({
              downloadableId,
            });
            setFiles([]);
          },
        }
      );
    } catch {}
    setIsSubmitting(false);
    setUploadProgress(0);
  };
  const getFileUploadUrl = trpc.s3.getFileUploadUrl.useMutation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFileWithIndex = async (index: number) => {
    const data = await getFileUploadUrl.mutateAsync({
      isPrivate: true,
    });
    if (!data?.url) {
      throw new Error("No Key");
    }
    const file = files[index];

    await axios.put(data?.url, file, {
      headers: {
        "Content-Type": file.type,
        // "x-amz-meta-fileName": file.name,
        // "x-amz-meta-path": file.path ?? "NONE",
      },
    });
    setUploadProgress(uploadProgress + 1);
    if (!data.key) {
      throw new Error("No Key");
    }
    return data.key;
  };

  if (isLoading || !downloadableData) {
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
          <Title order={2}>{downloadableData?.name}</Title>
          {downloadableDataRefetching && <Loader size={"sm"} />}
          {!downloadableDataRefetching && (
            <ContentStatusToggle
              contentId={downloadableData.Content?.id!}
              courseId={downloadableData.coursesId}
              defaultState={downloadableData.Content?.status!}
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
            <LoadingOverlay visible={updateDownloadableMutation.isLoading} />
            <TextInput
              type="text"
              disabled
              label="chapter id"
              {...getInputProps("downloadableId")}
            />
            <TextInput label="Name" {...getInputProps("name")} />

            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Paper>
      <Paper p={10}>
        <Title order={3} mb={10}>
          Manage Files
        </Title>
        <Group>
          {downloadableData.files.map((e, idx) => {
            return (
              <FileBox
                keyId={e.key}
                name={e.name || "NO NAME"}
                size={e.size ? BigInt(e.size).toString() : "0"}
                key={e.key}
              />
            );
          })}
        </Group>
      </Paper>
      <Paper
        p={10}
        sx={{
          position: "relative",
        }}
      >
        {isSubmitting && (
          <Overlay opacity={0.7}>
            <Center sx={{ height: "100%" }}>
              {uploadProgress === files.length && <Loader />}
              {uploadProgress !== files.length && (
                <RingProgress
                  sections={[
                    {
                      value: isNaN(
                        Math.round((uploadProgress * 100) / files.length)
                      )
                        ? 0
                        : Math.round((uploadProgress * 100) / files.length),
                      color: "blue",
                    },
                  ]}
                  label={
                    <Text color="blue" weight={700} align="center" size="xl">
                      {isNaN(Math.round((uploadProgress * 100) / files.length))
                        ? 0
                        : Math.round((uploadProgress * 100) / files.length)}
                    </Text>
                  }
                />
              )}
            </Center>
          </Overlay>
        )}
        <Stack>
          <Title order={3} mb={10}>
            Upload Files
          </Title>
          <FileDownloadableManager files={files} setFiles={setFiles} />
          <Button onClick={uploadAndAddFilesToDownloadable}>Upload</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
function FileBox({
  keyId,
  name,
  size,
}: {
  name: string;
  size: string;
  keyId: string;
}) {
  const removeFileMutation = trpc.downloadable.removeFile.useMutation();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const { downloadableId } = router.query as { downloadableId: string };
  const getDownloadUrl =
    trpc.s3.getFileDownloadUrlForDownloadable.useMutation();
  const [loading, setLoading] = useState(false);
  return (
    <Paper withBorder p={7} sx={{ width: 200, position: "relative" }}>
      <LoadingOverlay visible={removeFileMutation.isLoading} />
      <Stack spacing={3}>
        <Group position="apart">
          <IconFile size={20} />
          <ActionIcon
            color={"red"}
            onClick={() => {
              removeFileMutation.mutate(
                {
                  key: keyId,
                },
                {
                  onSuccess(data, variables, context) {
                    trpcContext.downloadable.getDownloadableById.invalidate();
                  },
                }
              );
            }}
          >
            <IconTrashX size={14} />
          </ActionIcon>
        </Group>
        <Stack spacing={0}>
          <Text lineClamp={1}>{name}</Text>
          <Text>{filesize(size, {}).toString()}</Text>
        </Stack>
        <Button
          onClick={() => {
            setLoading(true);
            getDownloadUrl.mutate(
              {
                downloadableId,
                key: keyId,
              },
              {
                onSettled() {},
                onSuccess(data, variables, context) {
                  if (!data) return;
                  window.URL = window.URL || window.webkitURL;

                  var xhr = new XMLHttpRequest(),
                    a = document.createElement("a"),
                    file;

                  xhr.open("GET", data, true);
                  xhr.responseType = "blob";
                  xhr.onload = function () {
                    file = new Blob([xhr.response], {
                      type: "application/octet-stream",
                    });
                    a.href = window.URL.createObjectURL(file);
                    a.download = name; // Set to whatever file name you want

                    // Now just click the link you created
                    // Note that you may have to append the a element to the body somewhere
                    // for this to work in Firefox
                    a.click();
                    setLoading(false);
                  };
                  xhr.send();
                },
              }
            );
          }}
          variant="outline"
          size="xs"
          disabled={loading}
        >
          {loading ? <Loader size="xs" /> : "Download"}
        </Button>
      </Stack>
    </Paper>
  );
}
export default function AddChapterWrapper() {
  return (
    <CourseWrapper>
      <DownloadableEditor />
    </CourseWrapper>
  );
}
