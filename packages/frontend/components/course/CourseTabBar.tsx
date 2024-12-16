import {
  Badge,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import { storeFrontId } from "@tutor/validation/lib/storefront";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import DashboardNav from "../navbar/dashboardNav";
import BackButton from "../utils/BackButton";
import { IconHome, IconBook, IconSettings } from "@tabler/icons";
import { CourseBadge } from "./courseBadge";

const Routes = [
  { label: "Home", value: "/", default: true, icon: <IconHome size={14} /> },
  {
    default: true,
    label: "curriculum",
    value: "/curriculum",
    icon: <IconBook size={14} />,
  },
  {
    label: "Settings",
    value: "/settings",
    icon: <IconSettings size={14} />,
  },
  // {
  //   label: "Video Manager",
  //   value: "/videoList",
  // },
];

export default function CourseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { id, courseId } = router.query;
  const { data: CourseData } = trpc.course.myCourseById.useQuery(
    {
      courseId: courseId as string,
    },
    { enabled: !!courseId }
  );
  const lastValueFromPath =
    router.asPath.split("/")[router.asPath.split("/").length - 1] ?? "";
  const normalLastvalue = Routes.map((e) => e.value).find(
    (e) => e === "/" + lastValueFromPath
  );
  const CurrentActiveValue = normalLastvalue
    ? normalLastvalue
    : courseId === lastValueFromPath
    ? "/"
    : "";
  return (
    <DashboardNav>
      <Stack mb="lg">
        <Paper p={10}>
          <Group>
            <BackButton />
            <Title my="auto">{CourseData?.name}</Title>
          </Group>
          <CourseBadge status={CourseData?.status ?? "INACTIVE"} />
        </Paper>
        <ScrollArea offsetScrollbars scrollbarSize={2} type="scroll">
          <Tabs
            my={6}
            variant="outline"
            value={CurrentActiveValue}
            onTabChange={(value) =>
              router.push(`/store/${id}/course/${courseId}${value}`)
            }
          >
            <Tabs.List
              sx={{
                flexWrap: "nowrap",
              }}
            >
              {Routes.map((e, idx) => {
                return (
                  <Tabs.Tab icon={e.icon} key={e.value} value={e.value}>
                    {e.label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
        </ScrollArea>
      </Stack>
      {children}
    </DashboardNav>
  );
}
