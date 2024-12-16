import { Button } from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
export default function NotFound() {
  return (
    <Button component={Link} href="/">
      Go Back
    </Button>
  );
}
