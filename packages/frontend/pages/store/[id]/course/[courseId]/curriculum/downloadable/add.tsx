import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  Overlay,
  Paper,
  RingProgress,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import MD5 from "crypto-js/md5";

import { useForm, zodResolver } from "@mantine/form";
import { IconPhoto, IconUpload, IconX, IconFile } from "@tabler/icons";
import { addDownloadable } from "@tutor/validation/lib/downloadable";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CourseWrapper from "../../../../../../../components/course/CourseTabBar";
import { trpc } from "../../../../../../../utils/trpc";
import type { FileWithPath } from "@mantine/dropzone";
import _ from "underscore";
import { promise } from "zod";
import { filesize } from "filesize";
import axios from "axios";
import { FileDownloadableManager } from "../../../../../../../components/utils/FileDownloadableManager";

type AddDownloadableValidationType = typeof addDownloadable["_input"];
function AddChapter() {
  const router = useRouter();
  const { courseId } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setValues, getInputProps, onSubmit, setFieldValue } =
    useForm<AddDownloadableValidationType>({
      validate: zodResolver(addDownloadable),
      initialValues: {
        name: "",
        courseId: "",
        fileList: [],
      },
    });
  useEffect(() => {
    if (!courseId) return;
    setFieldValue("courseId", courseId as string);
  }, [courseId]);

  const addDownloadableMutation =
    trpc.downloadable.addDownloadable.useMutation();
  const getFileUploadUrl = trpc.s3.getFileUploadUrl.useMutation();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const submitDownloadable = onSubmit(async (data) => {
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
      await addDownloadableMutation.mutateAsync(
        {
          courseId: data.courseId,
          fileList: allKeys,
          name: data.name,
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    } catch {}
    setIsSubmitting(false);
    setUploadProgress(0);
  });

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
    if (!data?.key) {
      throw new Error("No Key");
    }
    return data?.key;
  };
  return (
    <Stack>
      <Paper p={10}>
        <Title order={3}>Add Downloadable</Title>
      </Paper>

      <Paper p={10} sx={{ position: "relative" }}>
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
        <form onSubmit={submitDownloadable}>
          <Stack>
            <TextInput label="Name" required {...getInputProps("name")} />
            <TextInput type="hidden" {...getInputProps("courseId")} />
            <FileDownloadableManager setFiles={setFiles} files={files} />
            <Button type="submit">Add Downloadable</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export const FileVis = ({
  index,
  file,
  setFiles,
}: {
  index: number;
  file: FileWithPath;
  setFiles: Dispatch<SetStateAction<FileWithPath[]>>;
}) => {
  return (
    <Paper withBorder p={7} sx={{ width: 200 }}>
      <Stack spacing={2}>
        <Group position="apart">
          <IconFile size={20} />
          <ActionIcon
            color={"red"}
            onClick={() => {
              setFiles((files) => {
                return files.filter((_, idx) => idx !== index);
              });
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>
        <Stack spacing={0}>
          <Text lineClamp={1}>{file.name}</Text>
          <Text>{filesize(file.size, {}).toString()}</Text>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default function AddChapterWrapper() {
  return (
    <CourseWrapper>
      <AddChapter />
    </CourseWrapper>
  );
}
