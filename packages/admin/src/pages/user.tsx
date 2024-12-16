import { useDebouncedValue } from "@mantine/hooks";
import {
  Box,
  Group,
  Paper,
  Stack,
  Table,
  TextInput,
  Title,
  Text,
  Button,
  Loader,
  Center,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { IconMenu2, IconUser, IconBuildingStore } from "@tabler/icons";
import p from "@tutor/db";
type USER_STATUS = keyof typeof p.USER_STATUS;
export default function Users() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [email, setEmail] = useState<string>("");
  const [debounceEmail] = useDebouncedValue(email, 500);

  const { data, isLoading } = trpc.admin.user.getAllUsers.useQuery({
    limit: limit,
    skip: page * limit,
    email: debounceEmail ? debounceEmail : undefined,
  });
  return (
    <Stack p="xl">
      <Paper p="md" withBorder shadow={"lg"}>
        <Stack>
          <Title order={3}>User Managment</Title>
        </Stack>
        <TextInput
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Search User By Email"
        />
      </Paper>
      <Paper withBorder>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : data?.length === 0 ? (
          <Center my="lg">
            <Text>No User Data Found</Text>
          </Center>
        ) : (
          <Table striped withColumnBorders>
            <thead>
              <tr>
                <th>Id</th>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((e) => {
                return (
                  <tr>
                    <td>{e.id}</td>
                    <td>{e.email}</td>
                    <td>{e.name}</td>
                    <td>{e.status}</td>
                    <td>
                      <UserMenu id={e.id} status={e.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <Group position="apart" p="md">
          <Text weight={"bold"}>{page + 1}</Text>
          <Group>
            <Button
              variant="outline"
              onClick={() => {
                setPage(page - 1);
              }}
            >{`<`}</Button>
            <Button
              variant="outline"
              onClick={() => {
                setPage(page + 1);
              }}
            >{`>`}</Button>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
}

const UserMenu = ({ id, status }: { id: string; status: USER_STATUS }) => {
  const userUpdateMutation = trpc.admin.user.updateUser.useMutation();
  const trpcContext = trpc.useContext();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Center>
          <ActionIcon>
            <IconMenu2 size={16} />
          </ActionIcon>
        </Center>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>User</Menu.Label>
        <Menu.Item icon={<IconUser size={14} />}>Details</Menu.Item>
        <Menu.Item icon={<IconBuildingStore size={14} />}>
          Store-fronts
        </Menu.Item>
        <Menu.Label>User Actions</Menu.Label>
        <Menu.Item
          color={"red"}
          onClick={() => {
            userUpdateMutation.mutate(
              {
                userId: id,
                status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              },
              {
                onSuccess: () => {
                  trpcContext.admin.user.getAllUsers.invalidate();
                },
              }
            );
          }}
        >
          {status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
