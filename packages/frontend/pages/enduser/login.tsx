import {
  Alert,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffectOnce } from "react-use";
import { useRecoilState } from "recoil";
import { IndexPropType } from "..";
import EndUserPageWrapper from "../../components/enduser/layout/pageWrapper";
import { useLoginEndUserMutation } from "../../customQuery/login";
import { GetStoreAndCourseByHostName } from "../../functions/getStoreByHostName";
import { accessTokenAtom } from "../../state/accessTokenAtom";
export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function LoginPage(props: IndexPropType) {
  const { getInputProps, onSubmit } = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  const loginEnduserMutation = useLoginEndUserMutation();
  const router = useRouter();
  const submitLoginForm = onSubmit(async (data) => {
    loginEnduserMutation.mutate(
      {
        ...data,
        storefrontId: props.store?.id ?? "",
      },
      {
        onSuccess(data, variables, context) {
          setAccessToken(data.data.token);
          router.push("/");
        },
      }
    );
  });

  return (
    <EndUserPageWrapper
      storeId={props.store?.id}
      themeColor={props.store?.theme.color}
      iconUrl={props.store?.iconUrl?.url}
      name={props.store?.name ?? "Tutor"}
    >
      <Container my={20} size={"xs"}>
        <Paper radius="md" p="xl" withBorder>
          <Stack>
            <>
              <Title order={3}>
                Welcome Back,
                <Text color={props.store?.theme.color}>
                  {props.store?.name}
                </Text>
              </Title>
              <Divider />
              {loginEnduserMutation.error ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error"
                  color="red"
                >
                  Email or Password Is Wrong
                </Alert>
              ) : null}
              <form onSubmit={submitLoginForm}>
                <Stack>
                  <Title order={4}>Login</Title>
                  <TextInput
                    required
                    label="email"
                    type="email"
                    {...getInputProps("email")}
                  />
                  <TextInput
                    required
                    type="password"
                    label="password"
                    {...getInputProps("password")}
                  />
                  <Button type="submit">Login</Button>
                </Stack>
              </form>
              <Link href="/enduser/forgot" passHref>
                <Text sx={{ textDecoration: "none" }} component="a">
                  Have You Forget Your Password?
                  <Text
                    sx={{ textDecoration: "underline" }}
                    color={props.store?.theme.color}
                    component="span"
                  >
                    Forget Password
                  </Text>
                </Text>
              </Link>
              <Link href="/enduser/register" passHref>
                <Text sx={{ textDecoration: "none" }} component="a">
                  Don{"'"}t Have An Account?{" "}
                  <Text
                    sx={{ textDecoration: "underline" }}
                    color={props.store?.theme.color}
                    component="span"
                  >
                    Register
                  </Text>
                </Text>
              </Link>
            </>
          </Stack>
        </Paper>
      </Container>
    </EndUserPageWrapper>
  );
}

const AuthForm = () => {};
