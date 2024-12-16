import {
  Group,
  Paper,
  Title,
  TextInput,
  ActionIcon,
  ThemeIcon,
  Tooltip,
  Stack,
  Button,
  NumberInput,
  Text,
} from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useNumber } from "react-use";
import { trpc } from "../../utils/trpc";

export default function CourseMonetization() {
  const router = useRouter();
  const { courseId } = router.query as { courseId: string };

  const { data: courseData } = trpc.course.myCourseById.useQuery(
    {
      courseId: courseId,
    },
    {
      onSuccess(data) {
        if (!number) setNumber.set(data.price);
      },
      enabled: !!courseId,
    }
  );
  const [number, setNumber] = useNumber(courseData?.price ?? 0);

  const changePriceMutation = trpc.course.updateCoursePrice.useMutation();
  const trpcContext = trpc.useContext();
  return (
    <Paper p={10}>
      <Stack spacing={10}>
        <Title order={4}>Setup Monetization</Title>
        <Group>
          <NumberInput
            min={0}
            description="set this price to 0 to make it free."
            value={number}
            onChange={(e) => {
              if (typeof e !== undefined) setNumber.set(e ?? 0);
            }}
            label={"Price"}
            hideControls
            icon={
              <Tooltip label="Rupee">
                <ThemeIcon variant="light">
                  <IconCurrencyRupee size={14} />
                </ThemeIcon>
              </Tooltip>
            }
          />
          {number !== courseData?.price && (
            <Button
              onClick={() => {
                changePriceMutation.mutate(
                  {
                    courseId,
                    price: number,
                  },
                  {
                    onSuccess(data, variables, context) {
                      trpcContext.course.myCourseById.refetch({ courseId });
                    },
                  }
                );
                trpcContext.course.myCourseById.setData(
                  { courseId },
                  (data) => {
                    const newData = data;
                    if (newData) newData.price = number;
                    return newData;
                  }
                );
              }}
              mt={"auto"}
            >
              Set
            </Button>
          )}
        </Group>
        <Stack spacing={0}>
          <Text>Note:</Text>
          <Text size={"sm"}>
            We Recommend You To Contact Support For All Monetization Policy And
            Rules.
          </Text>
          <Text size={"xs"} color="yellow">
            You Have To Contact Support To Fully Enable Monetization And
            Publishing Of Your Content
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
