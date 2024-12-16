import { Menu, Button, Text, Avatar, ActionIcon, Group } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconArrowDown,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
export default function UserMenu() {
  const { data } = trpc.user.me.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 2,
  });

  const router = useRouter();
  const qClient = useQueryClient();
  const client = trpc.useContext();
  const LogoutMutation = trpc.auth.logout.useMutation({
    onSuccess() {
      router.replace("/auth/login");
      qClient.resetQueries();
      //TODO chnage this if needed
      // @ts-ignore
      // client.user.me.invalidate();
      client.resetQueries();
      //@ts-ignore
      client.invalidate();
      // client.queryClient.resetQueries();
    },
  });
  // const {data} = useSession()
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar src={data?.image}>{data?.name}</Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item component={Link} href="/dashboard/kyc">
          Kyc
        </Menu.Item>
        <Menu.Item component={Link} href="/dashboard/help">
          Help Desk
        </Menu.Item>

        <Menu.Label>Danger zone</Menu.Label>

        <Menu.Item
          onClick={() => {
            signOut({
              callbackUrl: "http://localhost:3000/auth/login",
            });
            // LogoutMutation.mutate();
          }}
          color="red"
          icon={<IconTrash size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
