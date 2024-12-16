import { Badge, Tooltip, Text, Button } from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
import type { InferQueryOutput } from "../../utils/types";

// type statusType = Exclude<
//   InferQueryOutput<"storefront.my-sites-by-id">,
//   null
// >["status"];

type statusType = Exclude<
  inferProcedureOutput<TrpcAppRouter["storefront"]["mySiteById"]>,
  null
>["status"];
export const activeToolTip =
  "User Can See Your Live Site And Able To Buy Courses And Watch Videos.".toLocaleLowerCase();

export const inactiveToolTip =
  "User Can See Your Live Site But Not Be Able To Buy Courses And Watch Videos. Even Free Ones".toLocaleLowerCase();
export default function StatusBadge({
  status,
  withText = false,
  withForm = false,
}: {
  status: statusType;
  withText?: boolean;
  withForm?: boolean;
}) {
  const statusText = status === "INACTIVE" ? inactiveToolTip : activeToolTip;
  return (
    <>
      <Tooltip withArrow multiline width={200} label={statusText}>
        <Badge color={status === "INACTIVE" ? "pink" : "blue"} variant="light">
          {status}
        </Badge>
      </Tooltip>
      {withText ? <Text>{statusText}</Text> : null}
      {withForm && status === "INACTIVE" ? (
        <Button size="sm" variant="outline">
          Activate Store Now
        </Button>
      ) : null}
    </>
  );
}
