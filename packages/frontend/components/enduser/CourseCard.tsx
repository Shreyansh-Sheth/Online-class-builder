import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import ImageSettings from "../../const/imageSettings";
import { IndexPropType } from "../../pages";
import { accessTokenAtom } from "../../state/accessTokenAtom";
import { trpc } from "../../utils/trpc";
import { BuyNowButton } from "./BuyNowButton";

export function CourseCard(props: IndexPropType["course"][number]) {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken] = useRecoilState(accessTokenAtom);
  const { data: me } = trpc.endUser.me.getMe.useQuery();

  const getOrderIdMutation = trpc.endUser.payment.createOrderId.useMutation();

  return (
    <Card
      sx={{
        width: 300,
        height: "100%",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
      radius="md"
      withBorder
    >
      <Card.Section>
        <Image
          fit="contain"
          src={props.posterImg.url || ""}
          // withPlaceholder
          width={ImageSettings.CourseImage.width}
          height={ImageSettings.CourseImage.height}
          alt="Course Image"
        />
      </Card.Section>

      <SimpleGrid cols={2} mt="md" mb="xs">
        <Text weight={500} lineClamp={2}>
          {props.name}
        </Text>
        <Group position="right">
          <Badge color="primary" size="lg" mr={0} my={"auto"}>
            {props.price === 0 ? "FREE" : props.price + " ₹"}
          </Badge>
        </Group>
      </SimpleGrid>

      <Group mt={"auto"} mb={0} spacing={1} position="apart">
        <BuyNowButton courseId={props.id} />
        <Button
          component={Link}
          href={`/course/${props.id}`}
          variant="light"
          fullWidth
          mt="md"
          radius="md"
        >
          Open Course
        </Button>
      </Group>
    </Card>
  );
}
