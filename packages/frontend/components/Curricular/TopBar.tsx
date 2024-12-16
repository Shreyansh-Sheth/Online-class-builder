import { Button, Group, Menu, Paper, Stack, Title } from "@mantine/core";
import {
  IconBook2,
  IconVideo,
  IconNotebook,
  IconFileDownload,
  IconZoomQuestion,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import CourseWrapper from "../course/CourseTabBar";
export default function CurriculumTopBar({ heading }: { heading?: string }) {
  return (
    <Paper p={10}>
      <Group position="apart">
        <Title>{heading ?? "Manage Curricular"}</Title>
        <AddContentMenu />
      </Group>
    </Paper>
  );
}

const AddContentMenu = () => {
  const router = useRouter();

  const { courseId, id } = router.query;
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>Add Content</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Content Types</Menu.Label>
        <Link
          href={`/store/${id}/course/${courseId}/curriculum/chapter/add`}
          passHref
        >
          <Menu.Item
            component={Link}
            href={`/store/${id}/course/${courseId}/curriculum/chapter/add`}
            icon={<IconBook2 size={14} />}
          >
            Chapter
          </Menu.Item>
        </Link>
        <Link href={`/store/${id}/course/${courseId}/curriculum/video/add`}>
          <Menu.Item icon={<IconVideo size={14} />}>Video</Menu.Item>
        </Link>
        {/* <Menu.Item icon={<IconZoomQuestion size={14} />}>Quiz</Menu.Item> */}

        <Link
          href={`/store/${id}/course/${courseId}/curriculum/note/add`}
          passHref
        >
          <Menu.Item icon={<IconNotebook size={14} />}>Note</Menu.Item>
        </Link>
        <Link
          href={`/store/${id}/course/${courseId}/curriculum/downloadable/add`}
          passHref
        >
          <Menu.Item icon={<IconFileDownload size={14} />}>
            Downloadable
          </Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  );
};
