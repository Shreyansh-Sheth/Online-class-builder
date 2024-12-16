import {
  Image,
  Container,
  Paper,
  FileButton,
  Text,
  Button,
  Center,
  Box,
  Stack,
  Loader,
  AspectRatio,
  RingProgress,
} from "@mantine/core";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

export default function UploadVideo({
  isPrivate = true,
  setKey,
  width,
  height,
  setUrl,
  label,
}: {
  width?: number;
  height?: number;
  isPrivate?: boolean;
  setKey: Dispatch<SetStateAction<string | null>>;
  setUrl?: Dispatch<SetStateAction<string | null>>;
  label?: string;
}) {
  const [file, setFile] = useState<null | File>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const getUploadUrlMutation = trpc.s3.getFileUploadUrl.useMutation();
  const uploadImage = (file: File) => {
    if (!file) {
      setIsError(true);
      return;
    }
    setLoading(true);
    getUploadUrlMutation.mutate(
      { isPrivate: isPrivate },
      {
        onError() {
          setIsError(true);
          setLoading(false);
        },
        async onSuccess(data, variables, context) {
          if (!data || !data.url) {
            setIsError(true);
            return;
          }
          try {
            await axios.put(data.url, file, {
              headers: { "Content-Type": file.type },

              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent?.total ?? 0)
                );
                setPercent(percentCompleted);
              },
            });
            if (setUrl) {
              setUrl(data.url);
            }

            setKey(data.key);
            setFile(file);
            setIsError(false);
          } catch {
            setIsError(true);
          }
          setLoading(false);
        },
      }
    );
  };
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);
  const getSignedViewUrl = trpc.s3.getSignedUrlForKey.useMutation();
  useEffect(() => {
    if (!file) return;
    getSignedViewUrl.mutate(getUploadUrlMutation.data?.key ?? "", {
      onSuccess(data) {
        if (data) {
          setFileObjectUrl(data);
        }
      },
    });
  }, [file]);

  return (
    <Box>
      <Paper>
        <Stack align={"flex-start"}>
          <AspectRatio
            ratio={16 / 9}
            sx={{ minWidth: 200, maxWidth: 400, width: "100%" }}
          >
            {fileObjectUrl ? (
              <video
                controls
                width={"100%"}
                height={"100%"}
                src={fileObjectUrl}
              ></video>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "gray",
                }}
              >
                {fileObjectUrl ? (
                  <Loader />
                ) : (
                  <Text color={"white"}>{label ?? "Upload Video"}</Text>
                )}
              </Box>
            )}
          </AspectRatio>
          {isError && <Text color="red">Error Uploading Video</Text>}
          <FileButton multiple={false} onChange={uploadImage} accept="video/*">
            {(props) =>
              loading ? (
                <RingProgress
                  sections={[{ value: percent, color: "blue" }]}
                  label={
                    <Text color="blue" weight={700} align="center" size="xl">
                      {percent}%
                    </Text>
                  }
                />
              ) : (
                <Button {...props}>{label ?? "Upload Video"}</Button>
              )
            }
          </FileButton>
        </Stack>
      </Paper>
    </Box>
  );
}
