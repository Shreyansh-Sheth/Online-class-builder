import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { IndexPropType } from "../../../..";
import DownloadableList from "../../../../../components/enduser/content/ContentDownloadable";
import ContentTitle from "../../../../../components/enduser/content/ContentTitle";
import ContentVideo from "../../../../../components/enduser/content/ContentVideo";
import RTDisplay from "../../../../../components/enduser/content/RTDisplay";
import EndUserPageWrapper from "../../../../../components/enduser/layout/pageWrapper";
import BackButton from "../../../../../components/utils/BackButton";
import { GetStoreAndCourseByHostName } from "../../../../../functions/getStoreByHostName";
import { trpc } from "../../../../../utils/trpc";
import Link from "next/link";
import { IconArrowNarrowLeft } from "@tabler/icons";
function Content() {
  const router = useRouter();
  const { courseId, contentId } = router.query as {
    courseId: string;
    contentId: string;
  };
  const { data: courseData } = trpc.endUser.course.getCourseById.useQuery(
    {
      courseId: courseId,
    },
    { enabled: !!courseId }
  );
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

  if (isLoading) {
    return (
      <Center sx={{ height: "100vh" }}>
        <Loader variant="bars" />
      </Center>
    );
  }
  if (isError || !contentData) {
    return (
      <Center sx={{ height: "100vh" }}>
        <Box>
          <Title mb={2} order={4}>
            You Dont Have Access To This Content
          </Title>
          <Center>
            <Button
              onClick={() => {
                router.push(`/course/${courseId}`);
              }}
            >
              Go Back
            </Button>
          </Center>
        </Box>
      </Center>
    );
  }

  return (
    <Container>
      <Group>
        <ActionIcon
          my="auto"
          component={Link}
          href={`/course/${courseId}`}
          color="primary"
          variant="light"
        >
          <IconArrowNarrowLeft size={18} />
        </ActionIcon>
        <Title order={3} lineClamp={1}>
          {courseData?.name}
        </Title>
      </Group>
      <Divider my={"xl"} />
      <Paper>
        <Stack>
          <ContentTitle />
          <ContentVideo />
          <DownloadableList />
          <RTDisplay />
        </Stack>
      </Paper>
    </Container>
  );
}

//////// DONT TOUCH THIS CODE
export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function ContentWrapper(props: IndexPropType) {
  return (
    <EndUserPageWrapper
      storeId={props.store?.id}
      themeColor={props.store?.theme.color}
      iconUrl={props.store?.iconUrl?.url}
      name={props.store?.name ?? "Tutor"}
    >
      <Content />
    </EndUserPageWrapper>
  );
}
