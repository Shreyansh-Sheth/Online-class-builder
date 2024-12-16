import {
  Container,
  Paper,
  Stack,
  TextInput,
  Title,
  Text,
  Divider,
  Button,
  Checkbox,
  NavLink,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextLink } from "@mantine/next";
import { verifyForgetPassword } from "@tutor/validation/lib/enduser/forget";
import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useEffectOnce } from "react-use";
import { useRecoilState } from "recoil";
import { IndexPropType } from "..";
import EndUserPageWrapper from "../../components/enduser/layout/pageWrapper";
import { useLoginEndUserMutation } from "../../customQuery/login";
import { GetStoreAndCourseByHostName } from "../../functions/getStoreByHostName";
import { accessTokenAtom } from "../../state/accessTokenAtom";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function LoginPage(props: IndexPropType) {
  const router = useRouter();
  const { token } = router.query as { token: string };
  const { getInputProps, onSubmit, setFieldValue } = useForm<
    typeof verifyForgetPassword["_input"]
  >({
    validate: zodResolver(verifyForgetPassword),
  });
  useEffect(() => {
    setFieldValue("token", token);
  }, [token]);

  const verifyForgetPasswordMutation =
    trpc.endUser.forgot.changePassword.useMutation();
  const submitNewPassword = onSubmit((data) => {
    verifyForgetPasswordMutation.mutate(data, {
      onSuccess: () => {
        router.push("/enduser/login");
      },
    });
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
            <Title order={3}>Reset Password</Title>
            <Divider />
            <form onSubmit={submitNewPassword}>
              <Stack>
                <Title order={4}>New Password</Title>
                <TextInput type="hidden" {...getInputProps("token")} />
                <TextInput
                  required
                  type="password"
                  label="password"
                  {...getInputProps("password")}
                />
                <TextInput
                  required
                  type="password"
                  label="confirmPassword"
                  {...getInputProps("confirmPassword")}
                />
                <Button type="submit">Login</Button>
              </Stack>
            </form>
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
          </Stack>
        </Paper>
      </Container>
    </EndUserPageWrapper>
  );
}

const AuthForm = () => {};
