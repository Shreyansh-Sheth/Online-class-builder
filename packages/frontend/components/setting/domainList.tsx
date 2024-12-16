import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconExternalLink } from "@tabler/icons";
import { addDomain } from "@tutor/validation/lib/storefront";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";

export default function DomainList() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = trpc.domain.getDomains.useQuery(
    {
      storeFrontId: id as string,
    },
    {
      enabled: !!id,
    }
  );
  const addDomainMutation = trpc.domain.addDomain.useMutation();
  const { getInputProps, onSubmit, setFieldValue, reset } = useForm({
    validate: zodResolver(addDomain),
    initialValues: {
      name: "",
      storeFrontId: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    setFieldValue("storeFrontId", id as string);
  }, [id, setFieldValue]);

  const client = trpc.useContext();
  const submitForm = onSubmit((data) => {
    addDomainMutation.mutate(
      {
        name: data.name,
        storeFrontId: data.storeFrontId,
      },
      {
        onSuccess: () => {
          // client.invalidateQueries(["domain.getDomains"]);
          client.domain.getDomains.invalidate();
        },
      }
    );
    reset();
  });
  return (
    <Container my={"md"}>
      <Paper radius="md" p="xl" withBorder>
        <Title size="h4">Hosting Settings</Title>
        <Divider my="md" />
        <Paper withBorder p={"md"}>
          <form onSubmit={submitForm}>
            <Stack>
              <Text>
                Want To Add Custom Domain As Primary Option? Contact Us Now To
                Get It Configured In Few Minutes.
              </Text>
              {addDomainMutation.isError && (
                <Alert
                  withCloseButton
                  onClose={() => addDomainMutation.reset()}
                  title="Bummer!"
                  color="red"
                >
                  {addDomainMutation.error?.message}
                </Alert>
              )}
              <TextInput
                sx={{
                  display: "none",
                }}
                hidden
                {...getInputProps("storeFrontId")}
              />
              <TextInput
                disabled
                sx={{ flexGrow: 1 }}
                placeholder="Domain Name"
                {...getInputProps("name")}
              />
              <Button variant="outline" disabled type={"submit"}>
                Add Domain
              </Button>
            </Stack>
          </form>
        </Paper>
        <Divider my={20} />
        <Title mb={10} order={4}>
          Linked Domains
        </Title>
        <Stack>
          {data
            ?.sort((a, b) => Number(a.isPrimary))
            .map((domain) => (
              <Paper p={10} key={domain.name} withBorder radius={"md"}>
                <Stack>
                  <Group position="apart">
                    <Box>
                      {domain.isPrimary ? <Badge>{"Primary"}</Badge> : null}
                    </Box>
                    <a
                      rel="noreferrer"
                      target={"_blank"}
                      href={"http://" + domain.name}
                    >
                      <ActionIcon>
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    </a>
                  </Group>
                  <Divider />
                  <Title order={5} lineClamp={2} mr={2}>
                    {domain.name}
                  </Title>
                  <Divider hidden />
                  <Group hidden position="apart" grow>
                    <Button variant="light">Refresh</Button>

                    <Button color="red" variant="light">
                      Delete
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            ))}
        </Stack>
      </Paper>
    </Container>
  );
}
