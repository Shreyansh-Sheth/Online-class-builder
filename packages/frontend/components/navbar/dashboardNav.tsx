import {
  AppShell,
  Badge,
  Burger,
  Center,
  Chip,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconLogout, IconSwitchHorizontal, IconSettings } from "@tabler/icons";
import { useState } from "react";
import { DarkModeToggle } from "../utils/DarkModeToggle";
import DashboardNavMainLinks from "./dashboardNavLinks";
import NavbarButtons from "./navbarButton";
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
  IconUsers,
  IconBook,
  IconCoinRupee,
  IconMessage,
  IconPageBreak,
  IconHome,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import StatusBadge from "../utils/statusBadge";
import version from "../../const/version";

const TopNavbarData = [
  {
    icon: <IconHome size={16} />,
    color: "violet",
    label: "Home",
    link: "",
  },

  {
    icon: <IconUsers size={16} />,
    color: "blue",
    label: "Users",
    link: "user",
  },
  {
    icon: <IconBook size={16} />,
    color: "teal",
    label: "Courses",
    link: "course",
  },
  // {
  //   icon: <IconPageBreak size={16} />,
  //   color: "violet",
  //   label: "Pagebuilder",
  //   link: "page",
  // },
  // {
  //   icon: <IconMessages size={16} />,
  //   color: "violet",
  //   label: "Discussion",
  //   link: "discussion",
  // },
  // {
  //   icon: <IconCoinRupee size={16} />,
  //   color: "grape",
  //   label: "Earnings",
  //   link: "earnings",
  // },
];

const BottomNavbarData = [
  {
    color: "indigo",
    icon: <IconSettings size={16} />,
    link: "setting",
    label: "Settings",
  },
  {
    color: "pink",
    icon: <IconSwitchHorizontal size={16} />,
    link: "/dashboard",
    label: "Switch",
    ignoreLinkAppend: true,
  },
];

export default function DashboardNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { id } = router.query;
  const { data: storeFrontData } = trpc.storefront.mySiteById.useQuery(
    id as string,
    {
      enabled: !!id,
    }
  );

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow>
            <DashboardNavMainLinks data={TopNavbarData} />
          </Navbar.Section>
          <Navbar.Section mb={50}>
            <DashboardNavMainLinks data={BottomNavbarData} />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header
          height={70}
          p="md"
          sx={{
            display: "flex",

            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title order={3}>{storeFrontData?.name}</Title>
          </div>
          <Center
            sx={{
              display: "flex",
              gap: "5px",
            }}
          >
            <Stack>
              <StatusBadge status={storeFrontData?.status ?? "INACTIVE"} />
            </Stack>
          </Center>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
