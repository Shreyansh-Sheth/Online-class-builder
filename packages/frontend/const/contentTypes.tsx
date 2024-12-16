import {
  IconBook2,
  IconFileDownload,
  IconNotebook,
  IconVideo,
  IconZoomQuestion,
} from "@tabler/icons";
export enum contentTypes {
  CHAPTER = "CHAPTER",
  VIDEO = "VIDEO",
  NOTES = "NOTES",
  DOWNLOADABLE = "DOWNLOADABLE",
  QUIZ = "QUIZ",
}
export const IconsFromTypes = {
  [contentTypes.DOWNLOADABLE]: {
    icon: <IconFileDownload size={14} />,
    color: "orange",
  },
  [contentTypes.NOTES]: { icon: <IconBook2 size={14} />, color: "pink" },
  [contentTypes.CHAPTER]: { icon: <IconNotebook size={14} />, color: "teal" },
  [contentTypes.VIDEO]: { icon: <IconVideo size={14} />, color: "indigo" },
  [contentTypes.QUIZ]: {
    icon: <IconZoomQuestion size={14} />,
    color: "lime",
  },
};
