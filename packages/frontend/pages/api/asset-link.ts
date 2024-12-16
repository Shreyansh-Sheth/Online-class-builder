//send manifest to client

import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default function handler(req: NextRequest, response: NextApiResponse) {
  response.send(LINK_ASSET);
}

const LINK_ASSET = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.skillflake.dashboard.twa",
      sha256_cert_fingerprints: [
        "29:A7:60:DA:24:DC:E1:20:D9:CE:5B:BF:8D:56:E7:DC:D1:8F:7A:CA:53:72:CC:02:93:2C:9E:C9:60:53:85:26",
      ],
    },
  },
];
