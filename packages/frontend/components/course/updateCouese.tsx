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
import { CreateCourse, updateCourse } from "@tutor/validation/lib/course";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import DashboardNav from "../navbar/dashboardNav";
import BackButton from "../utils/BackButton";
import UploadImage from "../utils/UploadImage";
import ImageSettings from "../../const/imageSettings";
import { trpc } from "../../utils/trpc";
type formType = Zod.infer<typeof updateCourse>;
export function UpdateCourse() {
  const router = useRouter();
  const { id, courseId } = router.query;
  const { getInputProps, setFieldValue, onSubmit, isValid, errors } =
    useForm<formType>({
      validate: zodResolver(updateCourse),
    });

  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    setFieldValue("posterImageKey", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (typeof courseId !== "string") {
      return;
    }
    setFieldValue("courseId", courseId);
  }, [courseId]);

  const [defaultImgUrl, setDefaultImgUrl] = useState("");
  const { data } = trpc.course.myCourseById.useQuery(
    {
      courseId: courseId as string,
    },
    {
      onSuccess(data) {
        setFieldValue("name", data.name);
        setFieldValue("posterImageKey", data.posterImg.key);
        setFieldValue("disc", data.disc ?? undefined);
        setDefaultImgUrl(data.posterImg.url ?? "");
      },
      enabled: !!courseId,
    }
  );

  const updateCourseMutation = trpc.course.updateCourse.useMutation();
  const trpcCtx = trpc.useContext();
  const SubmitUpdateCourse = onSubmit((data) => {
    updateCourseMutation.mutate(data, {
      onSuccess(data, variables, context) {
        trpcCtx.course.myCourseById.invalidate({
          courseId: courseId as string,
        });
      },
    });
  });

  return (
    <Stack>
      <Paper p={10}>
        <form onSubmit={SubmitUpdateCourse}>
          <Stack>
            <Title size="h4">Update Course Data</Title>
            <TextInput type="hidden" {...getInputProps("courseId")} />
            <TextInput label="name" required {...getInputProps("name")} />
            <Textarea label="description" {...getInputProps("disc")} />
            <UploadImage
              width={ImageSettings.CourseImage.width}
              height={ImageSettings.CourseImage.height}
              setKey={setKey}
              isPrivate={false}
              defaultImageUrl={defaultImgUrl}
            />
            <Button loading={updateCourseMutation.isLoading} type="submit">
              Update Course
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
