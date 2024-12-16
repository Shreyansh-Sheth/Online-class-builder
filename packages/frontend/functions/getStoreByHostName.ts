import { IndexPropType } from "../pages";
import VanillaClient from "../utils/vanillaClient";
import superjson from "superjson";

export async function GetStoreAndCourseByHostName({
  host,
}: {
  host: string | undefined;
}) {
  if (!host) {
    return {
      props: {
        store: null,
        course: [],
      },
    };
  }

  const data = await VanillaClient.site.byDomain.query(host);
  if (!data) {
    return {
      props: {
        store: null,
        course: [],
      },
    };
  }

  const ActiveCourses =
    await VanillaClient.endUser.course.getAllActiveCourse.query({
      storeFrontId: data?.id ?? "",
    });
  type storeType = IndexPropType["store"];
  type courseType = IndexPropType["course"];
  const storeData = superjson.serialize(data);
  const courseData = superjson.serialize(ActiveCourses);
  return {
    props: {
      course: courseData.json as unknown as courseType,
      store: storeData.json as storeType,
    },
  };
}
