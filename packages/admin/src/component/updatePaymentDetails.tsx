import { TrpcAppRouter } from "@tutor/server";
import type { inferProcedureOutput } from "@trpc/server";
import { useForm } from "@mantine/form";
import {
  Paper,
  TextInput,
  Stack,
  Title,
  Button,
  Collapse,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import { trpc } from "../utils/trpc";
type storeFrontPaymentProcessingDetails = Partial<
  inferProcedureOutput<
    TrpcAppRouter["admin"]["storefront"]["getAllStorefronts"]
  >[number]["storeFrontPaymentProcessingDetails"]
> & { storeFrontId: string };
export default function UpdatePaymentDetails(
  props: storeFrontPaymentProcessingDetails
) {
  const [opened, setOpened] = useState(false);

  const { getInputProps, isDirty, onSubmit } = useForm({
    initialValues: {
      storefrontId: props.storeFrontId,
      razorpayAccountId: props.razorpayAccountId,
      percentCut: props.percentCut ?? 10,
    },
  });
  const updateStorefrontPaymentMutation =
    trpc.admin.storefront.updateStoreFrontPaymentProcessingDetails.useMutation();
  const submitData = onSubmit((data) => {
    if (!data.razorpayAccountId) return;
    updateStorefrontPaymentMutation.mutate({
      storeFrontId: data.storefrontId,
      paymentProcessingDetails: {
        razorpayAccountId: data.razorpayAccountId,
        percentCut: data.percentCut,
      },
    });
  });
  return (
    <Paper>
      <Button onClick={() => setOpened((o) => !o)} component={Title} order={4}>
        Payment Details
      </Button>
      <Collapse in={opened}>
        <form onSubmit={submitData}>
          <Stack>
            <TextInput
              {...getInputProps("storefrontId")}
              disabled
              label="StorefrontId"
            />

            <TextInput
              minLength={2}
              {...getInputProps("razorpayAccountId")}
              label="Razorpay Account Id"
            />
            <NumberInput {...getInputProps("percentCut")} label="Percent Cut" />
            <Button
              type="submit"
              loading={updateStorefrontPaymentMutation.isLoading}
            >
              Update
            </Button>
          </Stack>
        </form>
      </Collapse>
    </Paper>
  );
}
