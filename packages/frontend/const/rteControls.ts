import type { RichTextEditorProps } from "@mantine/rte";
type toolBarControlType = Pick<RichTextEditorProps, "controls">["controls"];

export const WithoutMediaRteControls: toolBarControlType = [
  ["bold", "italic", "underline", "strike", "clean"],
  ["alignLeft", "alignCenter", "alignRight"],
  ["h1", "h2", "h3", "h4"],
  ["unorderedList", "orderedList"],
  ["sub", "sup"],
  ["link", "blockquote", "codeBlock", "code"],
];

const RteControls: toolBarControlType = [
  ...WithoutMediaRteControls,
  ["image", "video"],
];
export default RteControls;
