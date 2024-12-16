import {
  Badge,
  Group,
  Navbar,
  Paper,
  Stack,
  Text,
  DefaultMantineColor,
  Container,
  ThemeIcon,
  Title,
  Divider,
  Button,
  Box,
  SimpleGrid,
  Image,
  Loader,
  Center,
} from "@mantine/core";
import { RWebShare } from "react-web-share";

import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { IndexPropType } from "../..";
import { getNameFromData } from "../../../components/Curricular/dnd/SortableItem";
import EndUserPageWrapper from "../../../components/enduser/layout/pageWrapper";
import { GetStoreAndCourseByHostName } from "../../../functions/getStoreByHostName";
import { trpc } from "../../../utils/trpc";
import { IconCheck, IconLink } from "@tabler/icons";
import Link from "next/link";
import ImageSettings from "../../../const/imageSettings";
import { BuyNowButton } from "../../../components/enduser/BuyNowButton";
import ContentTypeBadge from "../../../components/enduser/content/contentTypeBadge";
export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function Course(props: IndexPropType) {
  return (
    <EndUserPageWrapper
      storeId={props.store?.id}
      themeColor={props.store?.theme.color}
      iconUrl={props.store?.iconUrl?.url}
      name={props.store?.name ?? "Tutor"}
    >
      <ContentList />
    </EndUserPageWrapper>
  );
}
type getCourseByIdType = inferProcedureOutput<
  TrpcAppRouter["endUser"]["course"]["getCourseById"]
>;
type content = Exclude<getCourseByIdType, null>["Content"][number];
const ContentList = () => {
  const router = useRouter();
  const { courseId } = router.query as { courseId: string };
  const [organizedContent, setOrganizedContent] =
    useState<getCourseByIdType>(null);
  const {
    data: userData,
    isError,
    isLoading: userLoading,
  } = trpc.endUser.me.getMe.useQuery(undefined, {
    retry: false,
  });
  const { data: courseData, isLoading } =
    trpc.endUser.course.getCourseById.useQuery(
      { courseId },
      {
        enabled: !!courseId,
        onSuccess: (data) => {
          if (!data) return;
          if (!data.CourseContentJSON || !data?.CourseContentJSON?.json) return;
          const jsonData = data.CourseContentJSON.json as {
            id: string;
            index: number;
          }[];

          const settleIndex = jsonData.sort((a, b) => a.index - b.index);

          const newData = data.Content.sort((a, b) => {
            const aIndex = settleIndex.findIndex((x) => x.id === a.id);
            const bIndex = settleIndex.findIndex((x) => x.id === b.id);
            return aIndex - bIndex;
          });

          setOrganizedContent({ ...data, Content: newData });
          console.dir({ ...data, Content: newData });
        },
      }
    );
  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }
  return (
    <>
      <Paper p={"sm"}>
        <SimpleGrid
          breakpoints={[
            { minWidth: 0, cols: 1 },
            {
              minWidth: 768,
              cols: 2,
            },
          ]}
        >
          <Center>
            <Image
              alt={courseData?.name ?? "Simple Image"}
              width={ImageSettings.CourseImage.width}
              height={ImageSettings.CourseImage.height}
              fit={"contain"}
              src={courseData?.posterImg.url}
            />
          </Center>
          <Stack justify={"space-between"} py={5}>
            <Title order={3}>{courseData?.name}</Title>
            <Text>{courseData?.disc}</Text>
            <Group position="right">
              {courseData?.purchase.length === 0 && (
                <Text
                  size="xl"
                  sx={(theme) => ({
                    color: theme.fn.primaryColor(),
                  })}
                  weight="bold"
                >
                  {courseData?.price === 0 ? "FREE" : courseData?.price + " ₹"}
                </Text>
              )}
            </Group>
            <Group grow>
              <BuyNowButton
                size="sm"
                radius={"xs"}
                mt="auto"
                courseId={courseId}
              />
              <RWebShare
                data={{
                  text: courseData?.name,
                  url: window.location.href,
                }}
              >
                <Button size="sm" variant="light">
                  Share Now
                </Button>
              </RWebShare>
            </Group>
          </Stack>
        </SimpleGrid>
        <Divider my={5} />
      </Paper>
      <Box my={20}></Box>
      <Container>
        <Title mt={30} order={3}>
          Course curriculum
        </Title>
        <Divider my={10} />
        {organizedContent?.Content.length === 0 && (
          <Center>
            <Text color="dimmed">No Content Available</Text>
          </Center>
        )}
        <Stack spacing={10}>
          {organizedContent?.Content.map((data) => (
            <Paper
              component={Link}
              href={
                isError || userLoading
                  ? "/enduser/register"
                  : `/course/${courseId}/content/${data.id}`
              }
              p={"sm"}
              key={data.id}
              ml={data.type !== "CHAPTER" ? 20 : 0}
              withBorder
            >
              <Stack spacing={4}>
                <Group position="apart">
                  <Group>
                    <ContentTypeBadge type={data.type} />
                    {data.isDemo ? (
                      <Badge size={"xs"} color="indigo" variant="filled">
                        Demo
                      </Badge>
                    ) : (
                      <Box></Box>
                    )}
                  </Group>
                  {data.content_enduser[0]?.completed && (
                    <ThemeIcon size={"xs"} radius={"xl"}>
                      <IconCheck size={12} />
                    </ThemeIcon>
                  )}
                </Group>
                <Text weight={600} lineClamp={2}>
                  {getNameFromContent(data)}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export const getColorFromContent = (
  data: content["type"]
): DefaultMantineColor => {
  switch (data) {
    case "CHAPTER":
      return "blue";
    case "DOWNLOADABLE":
      return "violet";
    case "QUIZ":
      return "green";
    case "NOTES":
      return "yellow";
    default:
      return "cyan";
  }
};
const getNameFromContent = (content: content) => {
  if (content.type === "CHAPTER") {
    return content!.chapter!.name!;
  }
  if (content.type === "DOWNLOADABLE") {
    return content!.downloadable!.name!;
  }
  if (content.type === "VIDEO") {
    return content!.video!.name;
  }

  if (content.type === "NOTES") {
    return content!.notes!.name;
  }
  return "primary";
};
