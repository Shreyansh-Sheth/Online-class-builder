import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Image,
  Badge,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import { AppRouter } from "@tutor/server/lib/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { CourseBadge } from "../../../../components/course/courseBadge";
import DashboardNav from "../../../../components/navbar/dashboardNav";
import ImageSettings from "../../../../const/imageSettings";
import { trpc } from "../../../../utils/trpc";

const NoCoursePrompt = () => (
  <Paper p={10}>
    <Stack>
      <Center>
        <Text color={"gray"}>There Are No Course Right Now</Text>
      </Center>
      <Center>
        <Text color={"gray"}>Please Add One To Start</Text>
      </Center>
    </Stack>
  </Paper>
);
function Course() {
  const router = useRouter();
  const { id } = router.query;
  const { data: MyCoursesData, isLoading } = trpc.course.myCourse.useQuery(
    {
      storeFrontId: id as string,
    },
    {
      enabled: !!id,
    }
  );
  return (
    <Stack>
      <Paper p={10}>
        <Group position="apart">
          <Title>Courses</Title>
          <Link href={`/store/${id}/course/add`}>
            <Button>Add New Course</Button>
          </Link>
        </Group>
      </Paper>
      {isLoading && (
        <Center>
          <Loader />
        </Center>
      )}
      {MyCoursesData?.length === 0 && <NoCoursePrompt />}
      {MyCoursesData && MyCoursesData?.length > 0 && (
        <SimpleGrid
          breakpoints={[
            { maxWidth: "xs", cols: 1 },
            { minWidth: "sm", cols: 3 },
            { minWidth: 1200, cols: 4 },
          ]}
          mt="lg"
          mx={"10px"}
        >
          {MyCoursesData?.map((e, idx) => (
            <CourseCard {...e} key={idx} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}

type courseCardProps = inferProcedureOutput<
  TrpcAppRouter["course"]["myCourse"]
>[number];

const CourseCard = (props: courseCardProps) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Center
      sx={{
        width: "275px",
      }}
    >
      <Card
        mx="auto"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        radius="md"
        withBorder
      >
        <Card.Section>
          <Image
            fit="contain"
            src={props.posterImg.url || ""}
            withPlaceholder
            width={ImageSettings.CourseImage.width}
            height={ImageSettings.CourseImage.height}
            alt="Course Image"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} sx={{ width: "60%" }} lineClamp={1}>
            {props.name}
          </Text>
          <CourseBadge status={props.status} />
        </Group>

        {/* <Group>
          <Text
            size="sm"
            sx={{
              minHeight: "max-content",
            }}
            color="dimmed"
            lineClamp={3}
          >
            {props.disc}
          </Text>
        </Group> */}
        <Group mt={"auto"} mb={0} spacing={3} position="apart">
          <Button
            component={Link}
            href={`/store/${id}/course/${props.id}`}
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
          >
            Manage Course
          </Button>
        </Group>
      </Card>
    </Center>
  );
};

export default function CourseWrapper() {
  return (
    <DashboardNav>
      <Course />
    </DashboardNav>
  );
}
