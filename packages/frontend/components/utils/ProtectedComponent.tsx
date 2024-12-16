import { Center, Container, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

export default function ProtectedComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isError, isLoading } = trpc.user.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
    _optimisticResults: "optimistic",
  });
  const router = useRouter();
  useEffect(() => {
    if (isError) {
      router.replace("/auth/login");
    }
  }, [isError, router]);

  if (isLoading || isError) {
    return (
      <Container sx={{ height: "100vh", width: "100vw" }}>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  return <>{children}</>;
}
