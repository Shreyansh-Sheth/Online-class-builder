import { Center, AspectRatio, Button, Loader } from "@mantine/core";
import { videoId } from "@tutor/validation/lib/video";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

export default function ContentVideo() {
  const router = useRouter();
  const { courseId, contentId } = router.query as {
    courseId: string;
    contentId: string;
  };
  const {
    data: contentData,
    isError,
    isLoading,
  } = trpc.endUser.content.getNoteByContentId.useQuery(
    {
      contentId: contentId,
    },
    { enabled: !!contentId }
  );
  const getSignedVideoUrlMutation =
    trpc.endUser.content.getVideoStreamUrl.useMutation();

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }
  if (!contentData?.video) {
    return <></>;
  }
  return (
    <Center>
      <AspectRatio
        ratio={16 / 9}
        sx={{
          "@media (max-width: 768px)": {
            width: "100%",
          },

          width: "80%",
        }}
      >
        {getSignedVideoUrlMutation.isSuccess ? (
          <iframe
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            // style="border: none; position: absolute; top: 0; height: 100%; width: 100%"

            style={{
              border: "none",
              position: "absolute",
              top: 0,
              height: "100%",
              width: "100%",
            }}
            allowFullScreen={true}
            width={"100%"}
            height={"100%"}
            src={getSignedVideoUrlMutation?.data ?? ""}
          ></iframe>
        ) : (
          <Center
            sx={{
              backgroundColor: "gray",
            }}
          >
            <Button
              disabled={contentData?.video?.StreamStatus !== "READY_TO_STREAM"}
              onClick={() => {
                if (
                  contentData?.video?.StreamStatus === "READY_TO_STREAM" &&
                  contentData?.video?.id
                ) {
                  getSignedVideoUrlMutation.mutate({
                    videoId: contentData?.video?.id,
                  });
                }
              }}
              loading={getSignedVideoUrlMutation.isLoading}
              color={
                contentData?.video?.StreamStatus === "READY_TO_STREAM"
                  ? "blue"
                  : "gray"
              }
            >
              {contentData?.video?.StreamStatus === "READY_TO_STREAM"
                ? "Watch Video"
                : "Not Available"}
            </Button>
          </Center>
        )}
      </AspectRatio>
    </Center>
  );
}
