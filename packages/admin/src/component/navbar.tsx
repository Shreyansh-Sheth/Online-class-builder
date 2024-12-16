import { Button, Group, Paper, Title } from "@mantine/core";
import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("token")) navigate("/");
  });
  return (
    <Paper p="xl">
      <Group position="apart">
        <Title>Skillflake Admin</Title>
        <Button
          color="red"
          onClick={() => {
            sessionStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </Group>
      <Group>
        <NavLink to={"/dashboard"}>Users</NavLink>
        <NavLink to="/dashboard/storefront">Storefronts</NavLink>
      </Group>
    </Paper>
  );
}
export default function NavbarWrapper() {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
}
