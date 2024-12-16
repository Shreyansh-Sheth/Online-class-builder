import {
  Text,
  Button,
  Center,
  Container,
  SimpleGrid,
  Badge,
  Card,
  Group,
  Stack,
  Alert,
  Anchor,
} from "@mantine/core";
import MainUserNavbar from "../../components/navbar/mainUser";
import ProtectedComponent from "../../components/utils/ProtectedComponent";
import { trpc } from "../../utils/trpc";
import { IconPlus } from "@tabler/icons";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "../../components/utils/statusBadge";
import { useRouter } from "next/router";
import { useState } from "react";
function Dashboard() {
  const router = useRouter();
  const { data } = trpc.storefront.mySites.useQuery(undefined, {
    onSuccess(data) {
      if (data.length === 0) {
        router.push("/dashboard/create");
      }
    },
  });
  const [showAlert, setShowAlert] = useState(true);
  return (
    <>
      <MainUserNavbar />
      <Container
        my="lg"
        sx={{
          display: "none",
          // display: showAlert ? "block" : "none",
        }}
      >
        <Alert
          color="red"
          title="Important"
          withCloseButton
          onClose={() => {
            setShowAlert(false);
          }}
          closeButtonLabel="Close alert"
        >
          Please Complete Your Kyc To Make Your Site Live And Able Yo Use All
          Features.{" "}
          <Anchor component={Link} href="/dashboard/kyc">
            Complete Kyc
          </Anchor>
        </Alert>
      </Container>
      <main>
        <Container
          sx={{
            textAlign: "end",
          }}
        >
          <Link href="dashboard/create">
            <Button size="md" leftIcon={<IconPlus />}>
              <Text>Create New Site</Text>
            </Button>
          </Link>
        </Container>

        <SimpleGrid
          breakpoints={[
            { maxWidth: "xs", cols: 1 },
            { minWidth: "sm", cols: 2 },
            { minWidth: 1200, cols: 3 },
          ]}
          mt="lg"
          mx={"10px"}
        >
          {data?.map((e) => (
            <Card
              shadow="sm"
              p="md"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              key={e.id}
              radius="md"
              withBorder
            >
              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{e.name}</Text>
                <StatusBadge status={e.status} />
              </Group>

              <Group>
                <Text
                  size="sm"
                  sx={{
                    minHeight: "max-content",
                  }}
                  color="dimmed"
                  lineClamp={3}
                >
                  {e.description}
                </Text>
              </Group>

              <Group mt={"auto"} mb={0} spacing={3} position="apart">
                <Link href={`/store/${e.id}`}>
                  <Button color="blue" mt="md" radius="md">
                    Dashboard
                  </Button>
                </Link>
                {e.Domain.find((e) => e.isPrimary) && (
                  <a
                    href={
                      new URL(
                        "http://" + e.Domain.find((e) => e.isPrimary)?.name
                      ).href
                    }
                  >
                    <Button variant="outline" color="blue" mt="md" radius="md">
                      Open Live
                    </Button>
                  </a>
                )}
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </main>
    </>
  );
}

const ProtectedDashboard = () => (
  <ProtectedComponent>
    <Dashboard />
  </ProtectedComponent>
);

export default ProtectedDashboard;
