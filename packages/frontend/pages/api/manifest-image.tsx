import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";
import VanillaClient from "../../utils/vanillaClient";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.url) {
    // res.status = 404;
    res.status(404).send("Not found");
    return;
  }
  const { searchParams } = new URL(req.url);
  const height = searchParams.get("height") || "630";
  const width = searchParams.get("width") || "1200";
  const hostName = req.headers.host;
  if (!hostName) {
    res.status(404).send("Not found");
    return;
  }
  const siteData = await VanillaClient.site.byDomain.query(hostName);
  const imageUrl = siteData?.iconUrl?.url;
  if (!imageUrl) {
    res.status(404).send("Not found");
    return;
  }
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt="Logo"
        style={{
          width: width + "px",
          height: height + "px",
          objectFit: "contain",
        }}
        src={imageUrl}
      />
    ),
    {
      width: width ? parseInt(width) : 1200,
      height: height ? parseInt(height) : 630,
    }
  );
}
