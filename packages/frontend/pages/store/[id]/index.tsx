import {
  Box,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import DashboardNav from "../../../components/navbar/dashboardNav";

import React from "react";
import dynamic from "next/dynamic";
import { TopStats } from "../../../components/storefront/TopStats";

const StoreMainPage = () => {
  return <TopStats />;
};

export default function StoreHomeWrapper() {
  return (
    <DashboardNav>
      <StoreMainPage />
    </DashboardNav>
  );
}

export const Stat = ({
  title,
  change,
  subtext,
  icon,
  total,
}: {
  title: string;
  total: number;
  change?: number;
  subtext: string;
  icon: React.ReactNode;
}) => {
  return (
    <Box>
      <Paper p={10}>
        <Stack spacing={20}>
          <Group position="apart">
            <Text transform="uppercase" size="sm" color="dimmed" weight={600}>
              {title}
            </Text>
            <ThemeIcon variant="light">{icon}</ThemeIcon>
          </Group>
          <Stack spacing={0}>
            <Group spacing={5}>
              <Title>{total}</Title>
              {typeof change !== undefined && change && (
                <Text
                  sx={{ marginTop: "auto", marginBottom: "0px" }}
                  color={change > 0 ? "green" : "red"}
                  weight={600}
                >
                  {Math.abs(change)}%
                </Text>
              )}
            </Group>
            <Text size="xs" color="dimmed">
              {subtext}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
