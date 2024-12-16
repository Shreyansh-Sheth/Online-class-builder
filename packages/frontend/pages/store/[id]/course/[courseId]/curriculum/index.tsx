import {
  Button,
  Container,
  Group,
  Menu,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import CourseWrapper from "../../../../../../components/course/CourseTabBar";
import {
  IconBook2,
  IconVideo,
  IconNotebook,
  IconFileDownload,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import CurriculumTopBar from "../../../../../../components/Curricular/TopBar";
import MainDND from "../../../../../../components/Curricular/dnd/main";
function Curriculum() {
  return (
    <Stack>
      <CurriculumTopBar />
      <MainDND />
    </Stack>
  );
}

export default function CurriculumWrapper() {
  return (
    <CourseWrapper>
      <Curriculum />
    </CourseWrapper>
  );
}
