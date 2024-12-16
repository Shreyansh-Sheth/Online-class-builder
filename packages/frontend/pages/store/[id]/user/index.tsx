import {
  Paper,
  Stack,
  Table,
  Title,
  Group,
  Text,
  Container,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import DashboardNav from "../../../../components/navbar/dashboardNav";
import { trpc } from "../../../../utils/trpc";
import { IconCheck, IconArrowLeft, IconArrowRight } from "@tabler/icons";
const User = () => {
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState(0);
  const LIMIT = 2;

  const {
    data: helloData,
    isLoading,
    isError,
    refetch,
  } = trpc.auth.hello.useQuery();
  const { data: endUserList } = trpc.endUserManagement.listEndUsers.useQuery(
    {
      storeFrontId: id as string,
      limit: LIMIT,
      skip: page * LIMIT,
    },
    {
      enabled: !!id,
    }
  );
  return (
    <Stack>
      <Paper p={10}>
        <Title>Manage Users</Title>
      </Paper>
      <Paper p={10}>
        <Stack>
          <Group position="apart">
            <Title order={4}>User List</Title>
            <Group>
              <ActionIcon
                variant="outline"
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={page === 0}
              >
                <IconArrowLeft size={14} />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={(page + 2) * LIMIT > (endUserList?.count ?? Infinity)}
              >
                <IconArrowRight size={14} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea
            sx={{
              width: "100%",
            }}
          >
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Email Verified</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {endUserList?.users.map((val) => (
                  <tr key={val.id}>
                    <td>{val.name}</td>
                    <td>{val.email}</td>
                    <td>
                      {val.emailVerified ? (
                        <ActionIcon color="green">
                          <IconCheck size={14} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon>
                          <IconCheck />
                        </ActionIcon>
                      )}
                    </td>
                    <td>{new Date(val.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Paper>
    </Stack>
  );
};
export default function UserWrapper() {
  return (
    <DashboardNav>
      <User />
    </DashboardNav>
  );
}
