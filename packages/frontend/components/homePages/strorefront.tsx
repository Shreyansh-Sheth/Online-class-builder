import {
  Center,
  Container,
  Divider,
  MantineProvider,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { IndexPropType } from "../../pages";
import EndUserPageWrapper from "../enduser/layout/pageWrapper";
import { HeaderMegaMenu } from "../enduser/layout/navbar";
import { CourseCard } from "../enduser/CourseCard";
import { trpc } from "../../utils/trpc";

export default function StorefrontHome({ store, course }: IndexPropType) {
  const { data } = trpc.endUser.course.getPurchasedCourse.useQuery(undefined, {
    retry: 0,
  });
  return (
    <>
      <Head>
        <title>{store?.name}</title>
        <link
          rel="icon"
          type="image/x-icon"
          // href="null"
          href={store?.iconUrl?.url ?? "null"}
        />
      </Head>
      <EndUserPageWrapper
        storeId={store?.id}
        themeColor={store?.theme.color}
        iconUrl={store?.iconUrl?.url}
        name={store?.name ?? ""}
      >
        {/* <Hero /> */}
        <Stack align={"center"} justify="center">
          <Title align="center" color={store?.theme.color ?? "blue"}>
            {store?.name}
          </Title>
          <Container>
            <Text size="md">{store?.description}</Text>
          </Container>
        </Stack>
        <Divider my={30} />
        {data && (
          <Container px="0px" my={20}>
            <Stack spacing={10}>
              <Title order={3}>My Courses</Title>
              <SimpleGrid
                breakpoints={[
                  { minWidth: 980, cols: 3, spacing: "md" },
                  { minWidth: 755, cols: 2, spacing: "sm" },
                  { minWidth: 0, cols: 1, spacing: "sm" },
                ]}
              >
                {data.map((e, idx) => {
                  return <CourseCard {...e} key={idx} />;
                })}
              </SimpleGrid>
              {data.length === 0 && (
                <Center>
                  <Text>You have not purchased any courses yet.</Text>
                </Center>
              )}
              <Divider />
            </Stack>
          </Container>
        )}
        <Container px="0px" my={20}>
          <Stack>
            <Title order={3}>All Courses</Title>
            <SimpleGrid
              breakpoints={[
                { minWidth: 980, cols: 3, spacing: "md" },
                { minWidth: 755, cols: 2, spacing: "sm" },
                { minWidth: 0, cols: 1, spacing: "sm" },
              ]}
            >
              {course.map((e, idx) => {
                return <CourseCard {...e} key={idx} />;
              })}
            </SimpleGrid>
          </Stack>
        </Container>
      </EndUserPageWrapper>
    </>
  );
}
