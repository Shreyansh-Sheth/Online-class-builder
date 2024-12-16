import {
  Avatar,
  Box,
  Burger,
  Button,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  Image,
  Menu,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { access } from "fs";
import { useRecoilState } from "recoil";
import { useLogoutEndUserMutation } from "../../../customQuery/logout";
import { accessTokenAtom } from "../../../state/accessTokenAtom";
import { trpc } from "../../../utils/trpc";
import { IconLogout } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const Links = () => {
  const { classes, theme } = useStyles();

  return (
    <>
      {/* <NextLink key="all" href="allCourse" className={classes.link}>
        All Courses
      </NextLink>
      <NextLink href="#" key={"my"} className={classes.link}>
        My Courses
      </NextLink> */}
    </>
  );
};
const AuthButtons = () => (
  <>
    <Button component={Link} href="/enduser/register" size="sm">
      Join Now
    </Button>
  </>
);
const HomeIcon = ({
  iconUrl,
  name,
}: {
  name: string;
  iconUrl?: string | null;
}) => {
  return (
    <Link href={"/"}>
      <>
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt="ICON"
            width={"auto"}
            height={60}
            fit="contain"
          />
        ) : (
          <Text>{name}</Text>
        )}
      </>
    </Link>
  );
};

const LoggedInUserButton = ({ storeId }: { storeId?: string }) => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const logoutMutation = useLogoutEndUserMutation();
  const { data } = trpc.endUser.me.getMe.useQuery(undefined, {
    enabled: !!accessToken,
  });

  const genInitials = (name: string) => {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(rgx)] || [];

    return (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();
  };
  return (
    <Menu width={200}>
      <Menu.Target>
        <Avatar color="primary.main" radius="xl">
          {/* //@ts-ignore */}
          {genInitials(data?.name ?? "hello world")}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            logoutMutation.mutate(
              {
                storeFrontId: storeId!,
              },
              {
                onSuccess: () => {
                  setAccessToken(null);
                  window.localStorage.removeItem("accessToken");
                },
              }
            );
          }}
          color="red"
          icon={<IconLogout size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export function HeaderMegaMenu({
  name,
  iconUrl,
  storeId,
}: {
  name: string;
  iconUrl?: string | null;
  storeId?: string;
}) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  return (
    <Box>
      <Header height={70} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <HomeIcon iconUrl={iconUrl} name={name} />
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Links />
          </Group>

          <Group spacing={1}>
            {accessToken ? (
              <LoggedInUserButton storeId={storeId} />
            ) : (
              <AuthButtons />
            )}
          </Group>

          {/* <Group className={classes.hiddenDesktop}>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
            <Box hidden={!!!accessToken}>
              <LoggedInUserButton storeId={storeId} />
            </Box>
          </Group> */}
        </Group>
      </Header>

      {/* <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={<HomeIcon iconUrl={iconUrl} name={name} />}
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Links />
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Group position="center" grow pb="xl" px="md">
            {accessToken ? null : (
              // <LoggedInUserButton storeId={storeId} />
              <AuthButtons />
            )}
          </Group>
        </ScrollArea>
      </Drawer> */}
    </Box>
  );
}
