import { Center, Container, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

export default function PublicComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "authenticated") {
      router.replace("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <Container
        sx={{
          height: "100vh",
          width: "100vw",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Center>
          <Loader variant="dots" />
        </Center>
      </Container>
    );
  }

  return <>{children}</>;
}
