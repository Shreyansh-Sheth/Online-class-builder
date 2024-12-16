import { ActionIcon, Box, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { IconArrowNarrowLeft } from "@tabler/icons";
export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <Box>
      <ActionIcon
        variant="light"
        color="indigo"
        onClick={() => {
          if (href) {
            router.push(href);
          } else {
            router.back();
          }
        }}
      >
        <IconArrowNarrowLeft />
      </ActionIcon>
    </Box>
  );
}
