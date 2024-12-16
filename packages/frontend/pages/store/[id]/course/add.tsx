import {
  TextInput,
  Divider,
  Paper,
  Stack,
  Title,
  Input,
  Container,
  Textarea,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useId } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { CreateCourse } from "@tutor/validation/lib/course";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import DashboardNav from "../../../../components/navbar/dashboardNav";
import BackButton from "../../../../components/utils/BackButton";
import UploadImage from "../../../../components/utils/UploadImage";
import ImageSettings from "../../../../const/imageSettings";
import { trpc } from "../../../../utils/trpc";
type formType = Zod.infer<typeof CreateCourse>;
function AddCourse() {
  const router = useRouter();
  const { id } = router.query;
  const { getInputProps, setFieldValue, onSubmit, isValid } = useForm<formType>(
    {
      validate: zodResolver(CreateCourse),
    }
  );

  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    setFieldValue("posterImageKey", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (typeof id !== "string") {
      return;
    }
    setFieldValue("storeFrontId", id);
  }, [id]);

  const createCourseMutation = trpc.course.createCourse.useMutation();
  const createCourse = onSubmit((data) => {
    createCourseMutation.mutate(data, {
      onSuccess(data, variables, context) {
        router.push(`/store/${id}/course/${data.id}`);
      },
    });
  });

  return (
    <Stack>
      <BackButton />
      <Paper p={10}>
        <form onSubmit={createCourse}>
          <Stack>
            <Title>Add New Course</Title>
            <Divider />
            <TextInput type="hidden" {...getInputProps("storeFrontId")} />
            <TextInput label="name" required {...getInputProps("name")} />
            <Textarea label="description" {...getInputProps("disc")} />
            <UploadImage
              width={ImageSettings.CourseImage.width}
              height={ImageSettings.CourseImage.height}
              setKey={setKey}
              isPrivate={false}
              defaultImageUrl={null}
            />
            <Button loading={createCourseMutation.isLoading} type="submit">
              Create Course
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default function AddCourseWrapper() {
  return (
    <DashboardNav>
      <AddCourse />
    </DashboardNav>
  );
}
