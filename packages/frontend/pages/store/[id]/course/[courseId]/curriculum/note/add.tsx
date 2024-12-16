import { Button, Input, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Editor } from "@mantine/rte";
import { addNotes } from "@tutor/validation/lib/notes";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CourseWrapper from "../../../../../../../components/course/CourseTabBar";
import RichText from "../../../../../../../components/utils/RichText";
import RteControls from "../../../../../../../const/rteControls";
import { trpc } from "../../../../../../../utils/trpc";
import QuillDelta from "quill-delta";
import RteEditor from "../../../../../../../components/utils/RteEditor";

type AddNotesValidatoionType = typeof addNotes["_input"];
function AddChapter() {
  const router = useRouter();
  const { courseId } = router.query;
  const { setValues, getInputProps, onSubmit, setFieldValue } =
    useForm<AddNotesValidatoionType>({
      validate: zodResolver(addNotes),
      initialValues: {
        name: "",
        courseId: "",
        urlList: [],
        note: "<h1>Hello</h1>",
      },
    });
  useEffect(() => {
    if (!courseId) return;
    setFieldValue("courseId", courseId as string);
  }, [courseId]);

  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const addNoteMutation = trpc.note.addNote.useMutation();

  const addNewNote = onSubmit((data) => {
    addNoteMutation.mutate(
      {
        ...data,
        courseId: courseId as string,
        urlList: imageUrlList,
      },
      {
        onSuccess() {
          router.back();
        },
      }
    );
  });

  return (
    <Stack>
      <Paper p={10}>
        <Title order={3}>Add New Note</Title>
      </Paper>

      <Paper p={10}>
        <form onSubmit={addNewNote}>
          <Stack>
            <TextInput label="Name" required {...getInputProps("name")} />
            <TextInput type="hidden" {...getInputProps("courseId")} />

            <Input.Wrapper label="Info">
              <RteEditor {...getInputProps("note")} setUrl={setImageUrlList} />
            </Input.Wrapper>
            <Button type="submit">Add Note</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default function AddNoteWrapper() {
  return (
    <CourseWrapper>
      <AddChapter />
    </CourseWrapper>
  );
}
