import { TextInput, Stack, Button } from "@mantine/core";
import { useState } from "react";
import UploadImage from "../../../utils/UploadImage";
import { useEffect } from "react";
import { useMap } from "react-use";
export default function HeroEditable() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <Stack>
      <TextInput label="title" />
      <TextInput label="subtitle" />
      <UploadImage
        defaultImageUrl={null}
        isPrivate={false}
        height={90}
        width={160}
        setKey={() => {}}
        setUrl={setImageUrl}
      />
      <Button>Save</Button>
    </Stack>
  );
}
