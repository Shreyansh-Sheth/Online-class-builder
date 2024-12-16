import { Paper, Stack, Switch, Title, Text } from "@mantine/core";
import { useRouter } from "next/router";
import CourseMonetization from "../../../../../components/course/coursePrice";
import CourseStatusToggler from "../../../../../components/course/courseStatusToggler";
import CourseWrapper from "../../../../../components/course/CourseTabBar";
import { UpdateCourse } from "../../../../../components/course/updateCouese";
import { trpc } from "../../../../../utils/trpc";

function Settings() {
  const router = useRouter();
  const { courseId } = router.query as { courseId: string };
  const { data: courseData } = trpc.course.myCourseById.useQuery(
    {
      courseId: courseId,
    },
    {
      enabled: !!courseId,
    }
  );
  const toggleCourseStatus = trpc.course.toggleCourse.useMutation();
  const trpcContext = trpc.useContext();
  return (
    <Stack>
      <Paper p={10}>
        <Title>Setting</Title>
      </Paper>
      <UpdateCourse />
      <CourseMonetization />
      <CourseStatusToggler />
    </Stack>
  );
}

export default function WrappedCourseSettings() {
  return (
    <CourseWrapper>
      <Settings />
    </CourseWrapper>
  );
}
