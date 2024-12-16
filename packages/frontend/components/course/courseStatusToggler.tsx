import { Paper, Stack, Switch, Title, Text, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { data } from "../fake/graph";

export default function CourseStatusToggler() {
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
    <Paper p={10}>
      <Title order={4}>Course Status</Title>

      {toggleCourseStatus.isLoading && false ? (
        <Loader size={"sm"} />
      ) : (
        <Switch
          mt={20}
          label={courseData?.status}
          checked={courseData?.status === "ACTIVE"}
          onChange={() => {
            toggleCourseStatus.mutate({ courseId });
            trpcContext.course.myCourseById.setData(
              { courseId },
              // @ts-ignore
              (data) => ({
                ...data,
                status: data?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              })
            );
          }}
        />
      )}

      <Text size={"sm"} color="red">
        NOTE: By Disabling This Button People Will Not Be Able To Buy Your
        Course But People Who Bought This Course Will Be Able To See This
      </Text>
    </Paper>
  );
}
