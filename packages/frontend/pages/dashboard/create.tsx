import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Center,
  Paper,
  Container,
  TextInput,
  Stack,
  Textarea,
  Title,
  Text,
} from "@mantine/core";
import MainUserNavbar from "../../components/navbar/mainUser";
import { useForm, zodResolver } from "@mantine/form";
import { trpc } from "../../utils/trpc";
import { createStoreFront } from "@tutor/validation";
import { useRouter } from "next/router";
import BackButton from "../../components/utils/BackButton";

export default function CreateSite() {
  const router = useRouter();
  const { getInputProps, onSubmit } = useForm({
    validate: zodResolver(createStoreFront),
    initialValues: {
      name: "",
      description: "",
    },
  });
  const createStorefrontMutation = trpc.storefront.create.useMutation({
    onSuccess(data) {
      router.push("/store/" + data.id);
    },
  });
  const submitCreateSite = onSubmit((data) => {
    createStorefrontMutation.mutate(data);
  });
  return (
    <>
      <MainUserNavbar showBackButton backButtonHref="/dashboard" />

      <form onSubmit={submitCreateSite}>
        <Container sx={{ marginTop: "50px" }}>
          <Paper radius="md" p="xl" withBorder>
            <Stack mb="xl">
              <Title>Start Of Something Great!</Title>
              <Text>Create Site And Start Your Own Online Coaching</Text>
            </Stack>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Karate Kitchen"
                {...getInputProps("name")}
              />
              <Textarea
                rows={5}
                label="Description"
                placeholder="Few Words About What Its All About."
                {...getInputProps("description")}
              />

              <Button
                loading={createStorefrontMutation.isLoading}
                type="submit"
              >
                Create
              </Button>
            </Stack>
          </Paper>
        </Container>
      </form>
    </>
  );
}
