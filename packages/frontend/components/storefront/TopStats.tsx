import {
  Group,
  Select,
  SelectItem,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconUser, IconShoppingCart, IconCoinRupee } from "@tabler/icons";
import React, { useMemo, useState } from "react";
import { startOfDay, startOfMonth, startOfWeek, addDays } from "date-fns";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Stat } from "../../pages/store/[id]/index";

// import { BarGraph } from "../../../components/fake/graph";
export function TopStats() {
  const date = useMemo(() => new Date(), []);
  const SelectData: SelectItem[] = [
    { label: "Today", value: startOfDay(date).toISOString() },
    { label: "This Week", value: addDays(date, -7).toISOString() },
    { label: "This Month", value: addDays(date, -30).toISOString() },
  ];
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [statsTimeFrame, setStatsTimeFrame] = useState(SelectData[0].value);
  const { data: userStatsData } = trpc.stats.users.useQuery({
    storefrontId: id,
    startTime: new Date(statsTimeFrame),
  });

  const { data: coursePurchaseCount } = trpc.stats.courses.useQuery({
    storefrontId: id,
    startTime: new Date(statsTimeFrame),
  });
  const { data: EarningTotal } = trpc.stats.earning.useQuery({
    storefrontId: id,
    startTime: new Date(statsTimeFrame),
  });
  return (
    <>
      <Group mb={20} position="right">
        <Stack spacing={0}>
          <Select
            data={SelectData}
            value={statsTimeFrame}
            onChange={(e) => {
              if (e) setStatsTimeFrame(e);
            }}
          />
          <Text size="sm" color={"gray"}>
            Analytics May Take Upto 10 Min To Update.
          </Text>
        </Stack>
      </Group>

      <SimpleGrid
        cols={3}
        breakpoints={[
          { minWidth: 980, cols: 3, spacing: "md" },
          { minWidth: 0, cols: 1 },
        ]}
      >
        <Stat
          icon={<IconUser size={14} />}
          title={"new users"}
          subtext="Onboard Users"
          total={userStatsData ?? 0}
        />
        <Stat
          icon={<IconShoppingCart size={14} />}
          title="Course Purchase"
          subtext="Overall Courses Purchased"
          total={coursePurchaseCount ?? 0}
        />
        <Stat
          icon={<IconCoinRupee size={14} />}
          title="Earning"
          subtext="This Much Amount You Earned"
          total={EarningTotal?.total ?? 0}
        />
      </SimpleGrid>
    </>
  );
}
