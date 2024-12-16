import { Switch, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";

export function ContentStatusToggle({
  defaultState,
  contentId,
  courseId,
  refetchFunc,
}: {
  courseId: string;
  contentId: string;
  defaultState: "ENABLE" | "DISABLE";
  refetchFunc?: () => void;
}) {
  const [switchState, setSwitchState] = useState(defaultState);
  useEffect(() => {
    setSwitchState(defaultState);
  }, [defaultState]);

  const trpcContext = trpc.useContext();
  const updateStatusMutation = trpc.content.updateContentStatus.useMutation();
  return (
    <Tooltip label={switchState === "DISABLE" ? "Enable" : "Disable"}>
      <Switch
        onLabel="Enable"
        offLabel="Disable"
        size="md"
        checked={switchState === "ENABLE"}
        onClick={() => {
          trpcContext.content.getContentList.setData(
            {
              courseId: courseId,
            },
            (data) => {
              return data?.map((e) => {
                if (e.id === contentId) {
                  return { ...e, status: "DISABLE" };
                } else {
                  return e;
                }
              });
            }
          );
          updateStatusMutation.mutate(
            { contentId: contentId },
            {
              onSuccess: () => {
                trpcContext.content.getContentList.refetch({
                  courseId: courseId,
                });

                trpcContext.chapter.getChapterById.invalidate();
              },
            }
          );
          setSwitchState(switchState === "ENABLE" ? "DISABLE" : "ENABLE");
        }}
        color="blue"
      />
    </Tooltip>
  );
}
