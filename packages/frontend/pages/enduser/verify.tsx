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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { IndexPropType } from "..";
import EndUserPageWrapper from "../../components/enduser/layout/pageWrapper";
import { useVerifyEndUserMutation } from "../../customQuery/verify";
import { GetStoreAndCourseByHostName } from "../../functions/getStoreByHostName";
import { accessTokenAtom } from "../../state/accessTokenAtom";

export const getServerSideProps: GetServerSideProps<IndexPropType> = async (
  context
) => {
  return await GetStoreAndCourseByHostName({ host: context.req.headers.host });
};

export default function Verify(props: IndexPropType) {
  const router = useRouter();
  const { token } = router.query;
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const verifyMutation = useVerifyEndUserMutation();
  useEffect(() => {
    verifyMutation.mutate(
      { token: token as string },
      {
        onSuccess(data, variables, context) {
          setAccessToken(data.data.token);
          router.push("/");
        },
      }
    );
    //TODO run mutation here
  }, [token]);
  return (
    <EndUserPageWrapper
      storeId={props.store?.id}
      themeColor={props.store?.theme.color}
      iconUrl={props.store?.iconUrl?.url}
      name={props.store?.name ?? "Tutor"}
    >
      <Container my={20} size={"xs"}>
        <Paper radius="md" p="xl" withBorder>
          {token ? <ValidateLoader /> : <BadTokenRetryPage />}
        </Paper>
      </Container>
    </EndUserPageWrapper>
  );
}
const BadTokenRetryPage = () => {
  return (
    <Stack>
      <Title order={4} align="center">
        Invalid Token
      </Title>
      <Divider />
      <Text align="center">Please Register Again For New Token</Text>
      <Button component={Link} href="/enduser/register">
        Register
      </Button>
    </Stack>
  );
};

const ValidateLoader = () => {
  return (
    <Stack>
      <Center>
        <Box>
          <Title order={3} align="center">
            Verification
          </Title>
          <Text size={"sm"} align="center">
            Wait A Second We Are Creating Your Account
          </Text>
        </Box>
      </Center>

      <Divider />
      <Loader mx="auto" variant="bars" />
      <Text size={"sm"} align="center">
        This Page Will Automatically Redirect Once Email Is Verified
      </Text>
    </Stack>
  );
};
