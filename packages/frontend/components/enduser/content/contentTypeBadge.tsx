import { Badge } from "@mantine/core";
import { IconsFromTypes, contentTypes } from "../../../const/contentTypes";
import { getColorFromContent } from "../../../pages/course/[courseId]";
import { inferProcedureOutput } from "@trpc/server";
import { TrpcAppRouter } from "@tutor/server";

type getCourseByIdType = inferProcedureOutput<
  TrpcAppRouter["endUser"]["course"]["getCourseById"]
>;
type content = Exclude<getCourseByIdType, null>["Content"][number];
export default function ContentTypeBadge({ type }: { type: content["type"] }) {
  return <Badge color={getColorFromContent(type)}>{type}</Badge>;
}
