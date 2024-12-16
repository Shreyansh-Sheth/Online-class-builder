import { Center, Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Dispatch, SetStateAction } from "react";
import { FileWithPath } from "@mantine/dropzone";
import { filesize } from "filesize";
import FileSizeLimits from "../../const/fileSizeLimits";
import { FileVis } from "../../pages/store/[id]/course/[courseId]/curriculum/downloadable/add";

export function FileDownloadableManager({
  files,
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<FileWithPath[]>>;
  files: FileWithPath[];
}) {
  return (
    <>
      <Dropzone
        onDrop={async (newFiles) => {
          setFiles([...files, ...newFiles]);
        }}
        onReject={(files) => {
          //TODO reject files
        }}
        maxSize={FileSizeLimits.DOWNLOADABLE_LIMIT}
      >
        <Center>
          <Text inline>Drag images here or click to select files</Text>
        </Center>
      </Dropzone>
      <Text>
        File Upload Limit is{" "}
        {filesize(FileSizeLimits.DOWNLOADABLE_LIMIT, {
          standard: "si",
        }).toString()}
      </Text>
      <Group>
        {files?.map((e, idx) => (
          <FileVis file={e} index={idx} key={idx} setFiles={setFiles} />
        ))}
      </Group>
    </>
  );
}
