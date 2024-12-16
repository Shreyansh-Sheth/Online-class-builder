import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import CourseWrapper from "../../../../../components/course/CourseTabBar";

function Course() {
  const router = useRouter();

  return (
    <Stack>
      <Paper p={10}></Paper>
    </Stack>
  );
}

export default function HomeCourseWrapper() {
  return (
    <CourseWrapper>
      <Course />
    </CourseWrapper>
  );
}
