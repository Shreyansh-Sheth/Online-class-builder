import { Alert, Button, Center, Container, Loader, Paper } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useEffectOnce } from "react-use";
import { trpc } from "../../../utils/trpc";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const tokenVerifyMutation = trpc.auth.verify.useMutation({
    onSuccess() {
      router.replace("/dashboard");
    },
  });
  useEffect(() => {
    if (!token) return;
    if (
      tokenVerifyMutation.isLoading ||
      tokenVerifyMutation.isSuccess ||
      tokenVerifyMutation.isError
    )
      return;
    tokenVerifyMutation.mutate({ token: token as string });
  }, [token, tokenVerifyMutation]);
  return (
    <Container sx={{ width: "40%", marginTop: "100px" }}>
      <Paper radius="md" p="xl" withBorder>
        {tokenVerifyMutation.isLoading && (
          <Center>
            <Loader />
          </Center>
        )}
        {tokenVerifyMutation.isError && (
          <Center sx={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Alert title="Error" color="red">
              Your Link Might Be Expired Please Try To Login Again
            </Alert>
            <Center sx={{ display: "flex", gap: 10 }}>
              <Button component={Link} href="/auth/login">
                Login
              </Button>
              <Button href="/auth/register" component={Link} variant="outline">
                Register
              </Button>
            </Center>
          </Center>
        )}
      </Paper>
    </Container>
  );
}
