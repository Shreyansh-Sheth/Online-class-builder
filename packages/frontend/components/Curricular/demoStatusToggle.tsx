import { Switch, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

export function DemoStatusToggle({
  defaultState,
  contentId,
  courseId,
  refetchFunc,
}: {
  courseId: string;
  contentId: string;
  defaultState: boolean;
  refetchFunc?: () => void;
}) {
  const [switchState, setSwitchState] = useState(defaultState);
  useEffect(() => {
    setSwitchState(defaultState);
  }, [defaultState]);

  const trpcContext = trpc.useContext();
  const updateDemoMutation = trpc.content.demoSwitch.useMutation();
  return (
    <Switch
      onLabel="Demo"
      offLabel="Paid"
      size="md"
      checked={switchState}
      onClick={() => {
        trpcContext.content.getContentList.setData(
          {
            courseId: courseId,
          },
          (data) => {
            return data?.map((e) => {
              if (e.id === contentId) {
                return { ...e, isDemo: !switchState };
              } else {
                return e;
              }
            });
          }
        );
        updateDemoMutation.mutate(
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
        setSwitchState(!switchState);
      }}
      color="blue"
    />
  );
}
