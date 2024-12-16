import { Center, Title, Text, Stack } from "@mantine/core";

export default function StoreNotFound() {
  return (
    <Center sx={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <Stack>
        <Center>
          <Title>404 Store Not Found</Title>
        </Center>
        <Text>You Have Not Enable The Store Or This Store Does Not Exist</Text>
      </Stack>
    </Center>
  );
}
