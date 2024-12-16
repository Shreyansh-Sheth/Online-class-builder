import { RichTextEditorProps } from "@mantine/rte";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useCallback } from "react";
import RteControls, { WithoutMediaRteControls } from "../../const/rteControls";
import { trpc } from "../../utils/trpc";
import RichText from "./RichText";

export default function RteEditor(
  props: RichTextEditorProps & { setUrl?: Dispatch<SetStateAction<string[]>> }
) {
  const imageUploadMutation = trpc.s3.getFileUploadUrl.useMutation();
  const handleImageUpload = useCallback(async (file: File) => {
    if (!props.setUrl) return "";
    const data = await imageUploadMutation.mutateAsync({
      isPrivate: false,
    });
    if (!data) return "";
    if (!data.url) {
      return "";
    }
    await axios.put(data.url, file, {
      headers: { "Content-Type": file.type },
    });
    props.setUrl((keys) => {
      return [...keys, data.fullURL];
    });
    return data.fullURL;
  }, []);
  const { setUrl: seturl, ...inputProps } = props;
  const showAll = typeof seturl !== "undefined";
  return (
    <RichText
      // controls={WithoutMediaRteControls}
      controls={showAll ? RteControls : WithoutMediaRteControls}
      onImageUpload={handleImageUpload}
      {...inputProps}
    />
  );
}
