import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { CourseBadge } from "../../course/courseBadge";
import ContentTypeBadge from "./contentTypeBadge";
import { useState } from "react";

export default function ContentTitle() {
  const router = useRouter();
  const { courseId, contentId } = router.query as {
    courseId: string;
    contentId: string;
  };
  const markAsCompleteMutation =
    trpc.endUser.content.markCompleteStatusSwitch.useMutation();
  const {
    data: contentData,
    isError,
    isLoading,
    refetch,
  } = trpc.endUser.content.getNoteByContentId.useQuery(
    {
      contentId: contentId,
    },
    { enabled: !!contentId }
  );
  const [checked, setChecked] = useState(
    contentData?.content_enduser?.at(0)?.completed ?? false
  );

  if (isLoading) {
    return <Loader />;
  }
  if (!contentData) {
    return <></>;
  }
  return (
    <Paper>
      <Stack>
        <Group position="apart">
          <ContentTypeBadge type={contentData?.type} />
          {markAsCompleteMutation.isLoading || isLoading ? (
            <Loader size={"xs"} />
          ) : (
            <Checkbox
              onClick={(e) => {
                setChecked(!checked);
                markAsCompleteMutation.mutate(
                  {
                    contentId: contentId,
                    isComplete: !(
                      contentData.content_enduser?.at(0)?.completed ?? false
                    ),
                  },
                  {
                    onSuccess: () => {
                      refetch();
                    },
                  }
                );
              }}
              checked={checked}
              radius={999}
              color="primary"
            />
          )}
        </Group>
        <Title order={2}>{GetNameFromContent(contentData!)}</Title>
      </Stack>
    </Paper>
  );
}
type contentDataQuery = inferProcedureOutput<
  TrpcAppRouter["endUser"]["content"]["getNoteByContentId"]
>;

const GetNameFromContent = (content: contentDataQuery) => {
  if (content.chapter) {
    return content.chapter.name;
  }
  if (content.downloadable) {
    return content.downloadable.name;
  }

  if (content.notes) {
    return content.notes.name;
  }
  if (content.video) {
    return content.video.name;
  }
  return "";
};
