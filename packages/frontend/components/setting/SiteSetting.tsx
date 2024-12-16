import {
  Button,
  Container,
  Divider,
  Paper,
  Textarea,
  TextInput,
  FileButton,
  Title,
  Box,
  Stack,
  Text,
  Image,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { updateStoreFront } from "@tutor/validation/lib/storefront";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { z } from "zod";
import FileSizeLimits from "../../const/fileSizeLimits";
import { trpc } from "../../utils/trpc";

export function SiteSetting() {
  const router = useRouter();
  const { id } = router.query;

  const { data: siteData, refetch } = trpc.storefront.mySiteById.useQuery(
    id as string,
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (!data) return;
        setFieldValue("name", data.name);
        setFieldValue("id", data.id);
        setFieldValue("description", data.description as string);
        setFieldValue("iconKey", data.fileKey ?? "");
      },
    }
  );
  const { getInputProps, onSubmit, setFieldValue, errors } = useForm({
    initialValues: {
      name: siteData?.name ?? "",
      id: siteData?.id ?? "",
      description: siteData?.description ?? "",
      iconKey: siteData?.fileKey ?? "",
    },
    validate: zodResolver(updateStoreFront),
  });
  const siteSettingMutation = trpc.storefront.update.useMutation();
  const submitForm = onSubmit((data) => {
    siteSettingMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  });
  const getUploadUrlMutation = trpc.s3.getFileUploadUrl.useMutation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      return;
    }
    if (file.size > FileSizeLimits.SITE_LOGO_LIMIT) {
      setFileError("File Size Too Big");
      return;
    }

    setFileError(null);
    getUploadUrlMutation.mutate(
      { isPrivate: false },
      {
        onSuccess: async (data) => {
          if (!data) return;
          if (!data.url) return;
          setUploading(true);
          await axios.put(data.url, file, {
            headers: { "Content-Type": file.type },
            onUploadProgress(progressEvent) {
              //TODO add progress bar
            },
          });
          setFieldValue("iconKey", data.key);
          setUploading(false);
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <div>
      <Container my={"md"}>
        <Paper radius="md" p="xl" withBorder>
          <form onSubmit={submitForm}>
            <Title size="h4">Site Settings</Title>
            <Divider my="md" />
            <Stack>
              <TextInput {...getInputProps("id")} type="hidden" />
              <TextInput {...getInputProps("name")} label="name" />
              <TextInput {...getInputProps("iconKey")} type="hidden" />
              <Textarea label="description" {...getInputProps("description")} />
              <Box>
                <Image
                  width={200}
                  height={200}
                  fit="contain"
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : siteData?.iconUrl?.url ?? ""
                  }
                  alt={"LOGO"}
                  withPlaceholder
                  placeholder={
                    <Text align="center">There Is No Logo uploaded</Text>
                  }
                />

                <FileButton onChange={setFile} accept="image/*">
                  {(props) => (
                    <>
                      <Button color="indigo" {...props} mt={5}>
                        Upload New Logo
                      </Button>
                      {fileError && <Text color="red">{fileError}</Text>}
                    </>
                  )}
                </FileButton>
              </Box>
              <Button disabled={uploading} type="submit" mt={5}>
                Submit New Changes
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
