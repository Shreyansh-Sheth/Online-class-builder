import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Container,
  Box,
  Image,
  Divider,
  Modal,
} from "@mantine/core";
import DashboardNav from "../../../../components/navbar/dashboardNav";
import PageBuilder from "../../../../components/pageBuilder";
import modal from "@mantine/modals";
import { openContextModal } from "@mantine/modals";
import { useState } from "react";
import { NextLink } from "@mantine/next";

// function Page() {
//   return <PageBuilder />;
// }

function Page() {
  return (
    <Stack>
      <Paper p={10}>
        <Title>Page Builder</Title>
      </Paper>
      <Paper p={10}>
        <Title order={2}>Themes</Title>
        <Divider my={20} />
        <Group my={20}>
          <ThemeCard />
        </Group>
      </Paper>
    </Stack>
  );
}

const ThemeCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Title color="yellow">Work In Progress</Title>}
      >
        <Stack>
          <Text>
            We Are Currently Working On This Feature And This Feature Is Open To
            Public As Soon As Possible.
          </Text>
          <Divider />
          <Text>
            To Change Color Of Your Site You Can Go To Settings Page And Change
            Color There
          </Text>
          <Button
            onClick={() => setModalOpened(false)}
            variant="outline"
            color="red"
          >
            Close
          </Button>
        </Stack>
      </Modal>
      <Card
        sx={{
          maxWidth: 300,
        }}
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
      >
        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}> Default Theme</Text>
          <Badge variant="light">Selected</Badge>
        </Group>

        <Text size="sm" color="dimmed">
          This Theme Is Default And Comes With Every Store. Currently You Cannot
          Change This But We Are Working On To Make Other Customizable Themes.
        </Text>

        <Button
          onClick={() => setModalOpened(true)}
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          Change
        </Button>
      </Card>
    </>
  );
};

const SettingsWrapper = () => (
  <DashboardNav>
    <Page />
  </DashboardNav>
);
export default SettingsWrapper;
