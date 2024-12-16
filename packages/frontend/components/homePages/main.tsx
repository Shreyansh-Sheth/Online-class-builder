import { Box, Center, Loader, Stack, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";

export default function MainHome() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack>
        <Title order={2}>Skillflake</Title>
        <Center>
          <Loader variant="dots" />
        </Center>
      </Stack>
    </Box>
  );
}
