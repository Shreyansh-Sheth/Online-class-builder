import {
  Alert,
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useForm, zodResolver } from "@mantine/form";
import { register } from "@tutor/validation";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import PublicComponent from "../../components/utils/PublicComponent";

function AuthenticationImage() {
  const { getInputProps, onSubmit } = useForm({
    initialValues: { email: "", name: "" },
    validate: zodResolver(register),
  });
  const registerMutation = trpc.auth.register.useMutation();
  const submitRegister = onSubmit(async (data) => {
    registerMutation.mutate(data);
  });

  return (
    <Container sx={{ marginTop: "100px" }} size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Start Your Journey With Tutor
        </Text>

        <Space h={"md"} />
        {registerMutation.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error!"
            color="red"
            radius="md"
            withCloseButton
            onClose={() => {
              registerMutation.reset();
            }}
            variant="outline"
          >
            {registerMutation.error?.message}
          </Alert>
        )}
        {registerMutation.isSuccess && (
          <Alert color="blue" radius="md" variant="filled">
            Please Check Your Email To Continue
          </Alert>
        )}

        <form onSubmit={submitRegister}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              {...getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              {...getInputProps("email")}
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Button type="submit">Register</Button>
          </Group>
          <Text align="center" mt="md">
            Already Have An Account?
            <Anchor component={Link} href={"/auth/login"} weight={700}>
              Login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Container>
  );
}

const Wrapper = () => (
  <PublicComponent>
    <AuthenticationImage />
  </PublicComponent>
);
export default Wrapper;
