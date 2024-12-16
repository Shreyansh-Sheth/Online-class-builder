import React, { useEffect, useState } from "react";
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
  IconUsers,
  IconBook,
  IconCoinRupee,
  IconMessage,
} from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text, Stack } from "@mantine/core";
import NavbarButtons from "./navbarButton";
import { useRouter } from "next/router";

export default function DashboardNavMainLinks({
  data,
}: {
  data: {
    color: string;
    link: string;
    icon: React.ReactNode;
    label: string;
    ignoreLinkAppend?: boolean;
  }[];
}) {
  const router = useRouter();
  const { id } = router.query;
  const [idIndex, setIdIndex] = useState(
    router.asPath.split("/").findIndex((e) => e === id)
  );
  useEffect(() => {
    setIdIndex(router.asPath.split("/").findIndex((e) => e === id));
  }, [id, router.asPath]);

  const links = data.map((link) => (
    <NavbarButtons
      color={link.color}
      link={link.ignoreLinkAppend ? link.link : `/store/${id}/${link.link}`}
      icon={link.icon}
      text={link.label}
      key={link.label}
      matchRoute={
        router.asPath?.split("/")[idIndex + 1] || link.link
          ? router.asPath?.split("/")[idIndex + 1] === link.link
          : true
      }
    />
  ));
  return <Stack spacing={2}>{links}</Stack>;
}
