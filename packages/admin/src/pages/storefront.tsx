import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconExternalLink, IconLink } from "@tabler/icons";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoreFrontStatusBadge from "../component/storefrontStatusBadge";
import UpdatePaymentDetails from "../component/updatePaymentDetails";
import { trpc } from "../utils/trpc";

export default function StoreFront() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const page = Number(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } =
    trpc.admin.storefront.getAllStorefronts.useQuery({
      limit,
      skip: (page - 1) * limit,
    });
  const updateStorefrontPaymentMutation =
    trpc.admin.storefront.updateStoreFrontPaymentProcessingDetails.useMutation();
  return (
    <Stack>
      <Group position="apart" mx="lg">
        <Group>
          <Button
            onClick={() => {
              setSearchParams({ page: String(page - 1) });
            }}
          >
            {`<`}
          </Button>
          <Button
            onClick={() => {
              setSearchParams({ page: String(page + 1) });
            }}
          >
            {`>`}
          </Button>
        </Group>
        <p>{page}</p>
      </Group>
      <Stack mx="md">
        {data?.map((storefront) => (
          <Paper withBorder p="lg">
            <Stack>
              <Group position="apart">
                <Title order={3}>{storefront.name}</Title>
                <Group>
                  <StoreFrontStatusBadge
                    storefrontId={storefront.id}
                    status={storefront.status}
                  />

                  <ActionIcon
                    component="a"
                    target={"_blank"}
                    href={
                      "http://" +
                      storefront.Domain.find((e) => e.isPrimary)?.name
                    }
                  >
                    <IconExternalLink size={14} />
                  </ActionIcon>
                </Group>
              </Group>
              <UpdatePaymentDetails
                storeFrontId={storefront.id}
                percentCut={
                  storefront?.storeFrontPaymentProcessingDetails?.percentCut
                }
                razorpayAccountId={
                  storefront?.storeFrontPaymentProcessingDetails
                    ?.razorpayAccountId
                }
              />
            </Stack>
          </Paper>
        ))}
        {isLoading && <Loader />}
        {isError && <Text>Error</Text>}
      </Stack>
    </Stack>
  );
}
