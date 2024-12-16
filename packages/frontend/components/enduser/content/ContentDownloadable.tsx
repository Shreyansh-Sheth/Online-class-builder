import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconFile, IconTrashX } from "@tabler/icons";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { filesize } from "filesize";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";

export default function DownloadableList() {
  const router = useRouter();
  const { courseId, contentId } = router.query as {
    courseId: string;
    contentId: string;
  };
  const {
    data: contentData,
    isError,
    isLoading,
  } = trpc.endUser.content.getNoteByContentId.useQuery(
    {
      contentId: contentId,
    },
    { enabled: !!contentId }
  );
  useEffect(() => {
    if (!contentData) return;
    // setRteValue(getRichTextFromData(contentData));
  }, [contentData]);

  if (isLoading) {
    return <Loader />;
  }
  if (!contentData?.downloadable) return <></>;
  return (
    <Paper>
      <Title order={4} mb={2}>
        Downloads
      </Title>
      <SimpleGrid
        breakpoints={[
          { minWidth: 0, cols: 1 },
          { minWidth: 600, cols: 2 },
          { minWidth: 1000, cols: 4 },
        ]}
      >
        {contentData?.downloadable?.files.map((file) => (
          <Center key={file.key}>
            <FileBox {...file} keyId={file.key} />
          </Center>
        ))}
      </SimpleGrid>
    </Paper>
  );
}

type downloadableFileData = Exclude<
  inferProcedureOutput<
    TrpcAppRouter["endUser"]["content"]["getNoteByContentId"]
  >["downloadable"],
  null | undefined
>["files"][number] & { keyId: string };

function FileBox({ keyId, name, size, downloadableId }: downloadableFileData) {
  const router = useRouter();
  const getDownloadUrl =
    trpc.endUser.content.getDonwloadableSignedUrl.useMutation();
  const [loading, setLoading] = useState(false);
  return (
    <Paper withBorder p={7} sx={{ width: 200, position: "relative" }}>
      <Stack spacing={3}>
        <Group position="apart">
          <IconFile size={20} />
        </Group>
        <Stack spacing={0}>
          <Text lineClamp={1}>{name}</Text>
          <Text>{filesize(size, {}).toString()}</Text>
        </Stack>
        <Button
          onClick={() => {
            setLoading(true);
            if (!downloadableId) return;
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
                    a.download = name ?? "file"; // Set to whatever file name you want

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
