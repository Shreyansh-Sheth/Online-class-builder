import { Action } from "@dnd-kit/core/dist/store";
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
  Box,
  Group,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextLink } from "@mantine/next";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useBoolean, useEffectOnce } from "react-use";
import { useRecoilState } from "recoil";
import { IndexPropType } from "..";
import EndUserPageWrapper from "../../components/enduser/layout/pageWrapper";
import { GetStoreAndCourseByHostName } from "../../functions/getStoreByHostName";
import { themeColorEndUserAtom } from "../../state/themeColor";
import { IconEyeOff, IconEye, IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { registerEndUser } from "@tutor/validation/lib/enduser/auth";
import { trpc } from "../../utils/trpc";
import { addMinutes, differenceInSeconds } from "date-fns";

export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function LoginPage(props: IndexPropType) {
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
            <Title order={3}>
              Welcome To,
              <Text color={props.store?.theme.color}>{props.store?.name}</Text>
            </Title>
            <Divider />
            <RegisterFrom storeId={props.store?.id ?? ""} />
          </Stack>
        </Paper>
      </Container>
    </EndUserPageWrapper>
  );
}

const RegisterFrom = ({ storeId }: { storeId: string }) => {
  const { getInputProps, onSubmit, errors, setFieldValue, reset } = useForm<
    typeof registerEndUser["_input"]
  >({
    validate: zodResolver(registerEndUser),
  });
  const endUserRegisterMutation = trpc.endUser.register.register.useMutation();
  useEffect(() => {
    setFieldValue("storeFrontId", storeId);
  }, [storeId, setFieldValue, reset]);
  const [sendedAt, setSendedAt] = useState<Date>();
  const [passwordVisible, setPasswordVisible] = useBoolean(false);
  const registerUser = onSubmit((vals) => {
    endUserRegisterMutation.mutate(vals, {
      onSuccess: () => {
        const STime = addMinutes(new Date(), 3);
        setSendedAt(STime);
        changeTime(STime);
      },
    });
  });
  const [diff, setDiff] = useState(0);
  const changeTime = (sendedAt: Date) => {
    setTimeout(() => {
      if (!sendedAt) return;
      const dif = differenceInSeconds(sendedAt, new Date());
      setDiff(dif);
      if (dif > 0) {
        changeTime(sendedAt);
      }
    }, 1000);
  };

  const resendRegisterMutation =
    trpc.endUser.register.resendRegister.useMutation();
  return (
    <>
      {endUserRegisterMutation.isIdle && (
        <form onSubmit={registerUser}>
          <Stack>
            <Title order={4}>Create An Account</Title>
            <TextInput label="name" required {...getInputProps("name")} />
            <TextInput type="hidden" value={storeId} />
            <TextInput
              required
              label="email"
              type="email"
              {...getInputProps("email")}
            />
            <TextInput
              type={passwordVisible ? "text" : "password"}
              label="password"
              required
              {...getInputProps("password")}
              rightSection={
                <ActionIcon
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                >
                  {passwordVisible ? (
                    <IconEyeOff size={14} />
                  ) : (
                    <IconEye size={14} />
                  )}
                </ActionIcon>
              }
            />
            <TextInput
              type={"password"}
              label="confirm password"
              required
              {...getInputProps("confirmPassword")}
            />
            {/* <Checkbox label="I agree to sell my privacy"  /> */}
            <Checkbox
              {...getInputProps("tnc")}
              // error={"HGelmakxnas"}
              // label={"Read & Accept All The Terms And Conditions"}
              label={
                <Text span>Read & Accept All The Terms And Conditions</Text>
              }
              // label="hello"
            />
            <Button loading={endUserRegisterMutation.isLoading} type="submit">
              Register Account
            </Button>
            <Link href="/enduser/login" passHref>
              <Text component="a">
                Already Have An Account?{" "}
                <Text
                  sx={(theme) => ({
                    textDecoration: "underline",
                    color: theme.primaryColor,
                  })}
                  span
                >
                  Login
                </Text>
              </Text>
            </Link>
          </Stack>
        </form>
      )}

      {endUserRegisterMutation.isLoading && (
        <Stack>
          <Loader />
        </Stack>
      )}
      {endUserRegisterMutation.isSuccess && (
        <Stack>
          <Text>
            Please Check Email On{" "}
            <Text
              span
              weight={"bold"}
              sx={(theme) => ({ color: theme.fn.primaryColor() })}
            >
              {endUserRegisterMutation.variables?.email}
            </Text>{" "}
            <ActionIcon
              onClick={() => {
                endUserRegisterMutation.reset();
                reset();
                setFieldValue("storeFrontId", storeId);
              }}
              sx={{ display: "inline-grid" }}
            >
              <IconPencil size={14} />
            </ActionIcon>
          </Text>
          <Button
            loading={resendRegisterMutation.isLoading}
            onClick={() => {
              resendRegisterMutation.mutate(
                {
                  email: endUserRegisterMutation.variables?.email ?? "",
                  storeFrontId:
                    endUserRegisterMutation.variables?.storeFrontId ?? "",
                },
                {
                  onSuccess: () => {
                    setSendedAt(addMinutes(new Date(), 3));
                    changeTime(addMinutes(new Date(), 3));
                  },
                }
              );
            }}
            disabled={diff > 0}
          >
            {diff > 0 ? `Resend In ${diff} Seconds ` : "Resend"}
          </Button>
        </Stack>
      )}
      {endUserRegisterMutation.isError && (
        <AlreadyUser text={endUserRegisterMutation.error.message} />
      )}
    </>
  );
};

const AlreadyUser = ({ text }: { text?: string }) => (
  <Stack>
    <Title align="center" order={4}>
      {text ?? "You Already Have An Account"}
    </Title>
    <Link href={"/enduser/login"} passHref>
      Please Try To Login
    </Link>
  </Stack>
);
