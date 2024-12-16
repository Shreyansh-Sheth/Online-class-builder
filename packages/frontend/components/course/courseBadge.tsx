import { Badge } from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";
type statusType = inferProcedureOutput<
  TrpcAppRouter["course"]["myCourseById"]
>["status"];
export const CourseBadge = ({ status }: { status: statusType }) => {
  return <Badge color={status === "ACTIVE" ? "blue" : "red"}>{status}</Badge>;
};
