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
  Loader,
  Box,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NextLink } from "@mantine/next";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { IndexPropType } from "..";
import EndUserPageWrapper from "../../components/enduser/layout/pageWrapper";
import { GetStoreAndCourseByHostName } from "../../functions/getStoreByHostName";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function ForgotPassword(props: IndexPropType) {
  const { getInputProps, onSubmit, setFieldValue } = useForm({
    initialValues: {
      email: "",
    },
  });

  const forgotPasswordMutation =
    trpc.endUser.forgot.forgotPassword.useMutation();

  const submitForm = onSubmit((data) => {
    forgotPasswordMutation.mutate(
      {
        storeFrontId: props.store?.id ?? "",
        email: data.email,
      },
      {
        onSuccess: () => {},
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
            <Title order={3}>Forgot Password</Title>
            <Divider />
            {(forgotPasswordMutation.isSuccess ||
              forgotPasswordMutation.isError) && (
              <>
                <Text>
                  Please Check Email On{" "}
                  <Text
                    span
                    weight={"bold"}
                    sx={(theme) => ({ color: theme.fn.primaryColor() })}
                  >
                    {forgotPasswordMutation.variables?.email}
                  </Text>
                </Text>
              </>
            )}
            {forgotPasswordMutation.isIdle && (
              <form onSubmit={submitForm}>
                <Stack>
                  <TextInput
                    label="email"
                    type="email"
                    required
                    {...getInputProps("email")}
                  />
                  <Button type="submit">Forgot Password</Button>
                  <Text size={"sm"}>
                    We Will Send You Email To Reset Your Password
                  </Text>
                </Stack>
              </form>
            )}
          </Stack>
        </Paper>
      </Container>
    </EndUserPageWrapper>
  );
}
