import {
  Box,
  Divider,
  Loader,
  Paper,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import RichText from "../../utils/RichText";

export default function RTDisplay() {
  const router = useRouter();
  const { courseId, contentId } = router.query as {
    courseId: string;
    contentId: string;
  };
  const [rteValue, setRteValue] = useState<null | string | false>(null);
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
    setRteValue(getRichTextFromData(contentData));
  }, [contentData]);

  if (isLoading) {
    return <Loader />;
  }
  if (rteValue === false || rteValue === null) return <></>;
  return (
    <Paper>
      <Title order={4} mb={2}>
        Notes
      </Title>
      <Paper p={"sm"}>
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: rteValue }} />
          {/* <RichText readOnly value={rteValue} /> */}
        </TypographyStylesProvider>
      </Paper>
    </Paper>
  );
}

type contentDataQuery = inferProcedureOutput<
  TrpcAppRouter["endUser"]["content"]["getNoteByContentId"]
>;
const getRichTextFromData = (content: contentDataQuery) => {
  if (content.chapter) {
    return content.chapter.description;
  }
  if (content.downloadable) {
    return false;
  }

  if (content.notes) {
    return content.notes.note;
  }
  if (content.video) {
    return content.video.description;
  }
  return false;
};
