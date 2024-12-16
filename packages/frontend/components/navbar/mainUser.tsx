import { Center, Container, Group, Tabs, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import BackButton from "../utils/BackButton";
import { DarkModeToggle } from "../utils/DarkModeToggle";
import UserMenu from "./userMenu";
export default function MainUserNavbar({
  showBackButton = false,
  backButtonHref = "/",
}: {
  backButtonHref?: string;
  showBackButton?: boolean;
}) {
  const router = useRouter();
  const { data } = trpc.user.me.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 2,
  });
  useEffect(() => {
    // alert(router.query.activeTab);
  }, [router]);
  return (
    <Container
      my="lg"
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Group>
        {showBackButton && <BackButton href={backButtonHref} />}
        <Title order={2}>SkillFlake</Title>
      </Group>
      {/* <Tabs
        variant="pills"
        value={router.pathname as string}
        onTabChange={(value) => router.push(`${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="/dashboard">My Sites</Tabs.Tab>
          <Tabs.Tab value="/dashboard/help">Help Desk</Tabs.Tab>
          <Tabs.Tab value="/dashboard/kyc">Kyc</Tabs.Tab>
        </Tabs.List>
      </Tabs> */}
      <Center sx={{ display: "flex", gap: "5px" }}>
        <UserMenu />
        {/* <DarkModeToggle /> */}
      </Center>
    </Container>
  );
}
