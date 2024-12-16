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
  ActionIcon,
  CopyButton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useClipboard } from "@mantine/hooks";
import { updateStoreFront } from "@tutor/validation/lib/storefront";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { z } from "zod";
import FileSizeLimits from "../../const/fileSizeLimits";
import { trpc } from "../../utils/trpc";
import { IconClipboard } from "@tabler/icons";
import StatusBadge, { inactiveToolTip } from "../utils/statusBadge";
export function SiteData() {
  const router = useRouter();
  const { id } = router.query;

  const { data: siteData, refetch } = trpc.storefront.mySiteById.useQuery(
    id as string,
    {
      enabled: !!id,
    }
  );
  const { copy, copied } = useClipboard({ timeout: 2000 });
  return (
    <Container my={"md"}>
      <Paper radius="md" p="xl" withBorder>
        <Title size={"h4"}>Site Data</Title>
        <Stack my="sm">
          <TextInput
            disabled
            label="Site Id"
            value={siteData?.id}
            rightSection={
              <CopyButton value={siteData?.id || "Loading"}>
                {({ copied, copy }) => (
                  <ActionIcon
                    onClick={copy}
                    variant="filled"
                    color={copied ? "green" : "primary.main"}
                  >
                    <IconClipboard size={14} />
                  </ActionIcon>
                )}
              </CopyButton>
            }
          />
          <Box>
            <StatusBadge
              status={siteData?.status ?? "INACTIVE"}
              withText
              withForm
            />
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
