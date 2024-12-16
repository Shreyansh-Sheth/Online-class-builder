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
} from "@mantine/core";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import FileSizeLimits from "../../const/fileSizeLimits";
import { trpc } from "../../utils/trpc";

export default function UploadImage({
  defaultImageUrl,
  isPrivate,
  setKey,
  width,
  height,
  setUrl,
}: {
  width?: number;
  height?: number;
  defaultImageUrl: string | null;
  isPrivate: boolean;
  setKey: Dispatch<SetStateAction<string | null>>;
  setUrl?: Dispatch<SetStateAction<string | null>>;
}) {
  const [file, setFile] = useState<null | File>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const getUploadUrlMutation = trpc.s3.getFileUploadUrl.useMutation();
  const uploadImage = (file: File) => {
    if (!file) {
      setIsError(true);
      return;
    }
    if (file.size > FileSizeLimits.SITE_IMAGES_LIMIT) {
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

  return (
    <Box>
      <Paper>
        <Stack align={"flex-start"}>
          <Image
            height={height ?? 500 / 2}
            width={width ?? 500 / 2}
            withPlaceholder={!defaultImageUrl}
            src={
              // ""
              file ? URL.createObjectURL(file) : defaultImageUrl ?? ""
            }
            alt="No Image Is Here"
            fit="cover"
          ></Image>
          {isError && <Text color="red">Error Uploading Image</Text>}
          <FileButton onChange={uploadImage} accept="image/*">
            {(props) =>
              loading ? <Loader /> : <Button {...props}>Upload image</Button>
            }
          </FileButton>
          <Text color={"dimmed"}>Size Limit 1MB</Text>
        </Stack>
      </Paper>
    </Box>
  );
}
