import {
  CheckIcon,
  ColorSwatch,
  Container,
  Divider,
  Group,
  Paper,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export default function Theme({
  setTheme,
}: {
  setTheme?: (data: string) => void;
}) {
  const theme = useMantineTheme();
  const router = useRouter();
  const { id } = router.query;
  const { data: themeData, refetch } = trpc.theme.getTheme.useQuery(
    {
      storeFrontId: id as string,
    },
    {
      onSuccess(data) {
        if (setTheme) {
          setTheme(data?.color || "blue");
        }
      },
      enabled: !!id,
    }
  );

  const setThemeMutation = trpc.theme.updateTheme.useMutation();
  const ctx = trpc.useContext();
  const swatches = Object.keys(theme.colors).map((color) => (
    <ColorSwatch
      onClick={() => {
        if (!themeData || color === themeData.color || !id) return;
        if (setTheme) {
          setTheme(color);
        }
        ctx.theme.getTheme.setData(
          {
            storeFrontId: id as string,
          },
          {
            color: color,
            id: themeData.id,
          }
        );
        setThemeMutation.mutateAsync(
          {
            color: color,
            storeFrontId: id as string,
            themeId: themeData.id,
          },
          {
            onSuccess: () => {
              refetch();
            },
          }
        );
      }}
      key={color}
      sx={{ color: "#fff", cursor: "pointer" }}
      color={theme.colors[color][6]}
    >
      {themeData?.color === color && <CheckIcon width={7} />}
    </ColorSwatch>
  ));

  return (
    <Container my={"md"}>
      <Paper radius="md" p="xl" withBorder>
        <Title size="h4">Theme Settings</Title>
        <Divider my="md" />
        <Group spacing={"xs"}>{swatches}</Group>
      </Paper>
    </Container>
  );
}
