import {
  Paper,
  Stack,
  TextInput,
  ActionIcon,
  Group,
  Button,
  Collapse,
} from "@mantine/core";
import { useBoolean, useList } from "react-use";
import { ListActions } from "react-use/lib/useList";
import { IconTrash, IconPlus, IconEye, IconEyeOff } from "@tabler/icons";
import UploadImage from "../../../utils/UploadImage";

type feature = {
  name: string;
  description?: string;
};

export default function Testimonial() {
  const [featuresList, setFeaturesList] = useList<feature>();
  const [open, setOpen] = useBoolean(false);
  return (
    <Paper>
      <Group position="right">
        <ActionIcon
          color="cyan"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open && <IconEyeOff size={14} />}
          {!open && <IconEye size={14} />}
        </ActionIcon>
        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() => {
            setFeaturesList.push({
              name: "this is new feature",
              description: "",
            });
          }}
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Group>
      <Collapse in={open}>
        <Stack mt={5}>
          {featuresList.map((e, idx) => {
            return (
              <SingleTestimonial
                idx={idx}
                key={idx}
                feature={e}
                setFeaturesList={setFeaturesList}
              />
            );
          })}
        </Stack>
        <Group grow mt={10}>
          <Button onClick={() => {}}>Save</Button>
        </Group>
      </Collapse>
    </Paper>
  );
}
export const SingleTestimonial = ({
  idx,
  setFeaturesList,
  feature,
}: {
  idx: number;
  setFeaturesList: ListActions<feature>;
  feature: feature;
}) => {
  return (
    <Paper withBorder p={5}>
      <Stack>
        <Group position="right"></Group>
        <TextInput
          label={"Name"}
          value={feature.name}
          onChange={(e) => {
            setFeaturesList.updateAt(idx, {
              name: e.target.value,
              description: feature.description,
            });
          }}
        />
        <TextInput
          label={"Testimonial"}
          value={feature.description}
          onChange={(e) => {
            setFeaturesList.updateAt(idx, {
              name: feature.name,
              description: e.target.value,
            });
          }}
        />

        <Group grow>
          <ActionIcon
            color="red"
            onClick={() => {
              setFeaturesList.removeAt(idx);
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  );
};
