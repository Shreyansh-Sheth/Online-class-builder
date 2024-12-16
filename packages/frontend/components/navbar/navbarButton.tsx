import {
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
  DefaultMantineColor,
} from "@mantine/core";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavbarButtons({
  text,
  link,
  icon,
  color,
  matchRoute,
}: {
  text: string;
  link: string;
  icon: React.ReactNode;
  color: DefaultMantineColor;
  matchRoute: boolean;
}) {
  return (
    <UnstyledButton
      component={Link}
      href={link}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: !matchRoute
          ? "none"
          : theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[4],
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[4],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{text}</Text>
      </Group>
    </UnstyledButton>
  );
}
