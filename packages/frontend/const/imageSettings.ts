import React from "react";

const ImageSettings = {
  CourseImage: {
    aspectRation: 16 / 9,
    width: 300,
    height: (9 * 300) / 16,
    fit: "cover" as React.CSSProperties["objectFit"],
  },
};
export default ImageSettings;
