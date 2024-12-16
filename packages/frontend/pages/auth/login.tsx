import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { login } from "@tutor/validation";
import Link from "next/link";
import PublicComponent from "../../components/utils/PublicComponent";
import { trpc } from "../../utils/trpc";
import { Alert } from "@mantine/core";
import {
  IconAlertCircle,
  IconBrandDiscord,
  IconBrandGoogle,
} from "@tabler/icons";
import { useSession, signIn, signOut } from "next-auth/react";

function AuthenticationImage() {
  const { getInputProps, onSubmit } = useForm({
    validate: zodResolver(login),
    initialValues: { email: "" },
  });
  const loginMutation = trpc.auth.login.useMutation();
  const submitRegister = onSubmit((data) => {
    // console.log(data);
    loginMutation.mutate({ email: data.email });
  });
  const { data } = useSession();

  return (
    <Container sx={{ height: "100vh" }} size="xs">
      <Stack justify={"center"} sx={{ height: "100%" }}>
        <Center my="xl">
          <Stack>
            <Center>
              <Title>Skillflake</Title>
            </Center>
            <Center>
              <Text>Create Your Online Class In Minutes</Text>
            </Center>
          </Stack>
        </Center>
        {/* <Button
          color="indigo"
          onClick={() => signIn("discord")}
          leftIcon={<IconBrandDiscord size={18} />}
        >
          Login With Discord
        </Button> */}
        <Button
          color="red"
          onClick={() => signIn("google")}
          leftIcon={<IconBrandGoogle size={18} />}
        >
          Login With Google
        </Button>
      </Stack>
    </Container>
  );

  return (
    <Container sx={{ marginTop: "100px" }} size="xs">
      {" "}
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Login To Your Account
        </Text>
        {JSON.stringify(data)}
        <Button
          onClick={() => {
            signIn("discord", {
              // callbackUrl: "http://localhost:3000/auth/login",
              // redirect: "http://localhost:3000/auth/login",
            });
          }}
        >
          Next Auth Login
        </Button>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>

        <Space h={"md"} />
        {loginMutation.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error!"
            color="red"
            radius="md"
            withCloseButton
            onClose={() => {
              loginMutation.reset();
            }}
            variant="outline"
          >
            {loginMutation.error?.message}
          </Alert>
        )}
        {loginMutation.isSuccess && (
          <Alert color="blue" radius="md" variant="filled">
            Please Check Your Email To Continue
          </Alert>
        )}

        <form onSubmit={submitRegister}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              {...getInputProps("email")}
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Button type="submit">Login</Button>
          </Group>
          <Text align="center" mt="md">
            Don{"'"}t Have An Account?
            <Anchor href={"/auth/register"} component={Link} weight={700}>
              Register
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
