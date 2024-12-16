import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Title,
  ScrollArea,
} from "@mantine/core";
import MainUserNavbar from "../../components/navbar/mainUser";
import ProtectedComponent from "../../components/utils/ProtectedComponent";
import { trpc } from "../../utils/trpc";
import { NotionRenderer } from "react-notion-x";
import { NotionAPI } from "notion-client";
// import "react-notion-x/src/styles.css";
// import { Client } from "@notionhq/client";
import { TypographyStylesProvider } from "@mantine/core";
import BackButton from "../../components/utils/BackButton";

export async function getStaticProps() {
  const TOKEN = process.env.NOTION_SECRET;
  const PAGE_ID = process.env.NOTION_ROADMAP_PAGE_ID;
  const notionClient = new NotionAPI({
    activeUser: TOKEN,
  });
  const pageID = PAGE_ID;
  const pageData = await notionClient.getPage(pageID!);
  return {
    props: {
      notionPage: pageData,
    },
    revalidate: 60 * 60, // In Hours
  };
}
function Help({ notionPage }: { notionPage: object }) {
  // console.log(notionPage);
  return (
    <>
      <MainUserNavbar showBackButton backButtonHref="/dashboard" />

      <Stack align={"stretch"}>
        <Box mx={"lg"}>
          <Container>
            <Paper p={5} withBorder>
              <Group position="center">
                <Button variant="light" color="red">
                  Report A Bug
                </Button>
                <Button variant="light" color="blue">
                  Request Feature
                </Button>
                <Button variant="light" color="teal">
                  Chat With Us
                </Button>
              </Group>
            </Paper>
          </Container>
        </Box>
        <Center mb={20}>
          <Title>Roadmap</Title>
        </Center>
        <ScrollArea sx={{ width: "80vw" }}>
          <TypographyStylesProvider>
            <Container>
              {/* @ts-ignore */}
              <NotionRenderer recordMap={notionPage as ExtendedRecordMap} />
            </Container>
          </TypographyStylesProvider>
        </ScrollArea>
      </Stack>
    </>
  );
}

const ProtectedDashboard = ({ notionPage }: { notionPage: object }) => (
  <ProtectedComponent>
    <Help notionPage={notionPage} />
  </ProtectedComponent>
);

export default ProtectedDashboard;
