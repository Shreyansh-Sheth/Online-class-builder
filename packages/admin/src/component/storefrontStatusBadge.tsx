import { Badge, Group, Select } from "@mantine/core";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function StoreFrontStatusBadge({
  status,
  storefrontId,
}: {
  status: string;
  storefrontId: string;
}) {
  const [CurrentStatus, setCurrentStatus] = useState(status);
  const updateStatusMutatution =
    trpc.admin.storefront.updateStatus.useMutation();
  return (
    <Group>
      <Badge
        size="lg"
        color={
          CurrentStatus === "LIVE"
            ? "green"
            : CurrentStatus === "HOLD"
            ? "yellow"
            : "red"
        }
      >
        {CurrentStatus}
      </Badge>
      <Select
        onChange={(e) => {
          if (!e) return;
          setCurrentStatus(e);
          updateStatusMutatution.mutate({
            storeFrontId: storefrontId,
            // @ts-ignore
            status: e,
          });
        }}
        value={CurrentStatus}
        data={[
          { label: "LIVE", value: "LIVE" },
          { label: "HOLD", value: "HOLD" },
          { label: "INACTIVE", value: "INACTIVE" },
        ]}
      ></Select>
    </Group>
  );
}
