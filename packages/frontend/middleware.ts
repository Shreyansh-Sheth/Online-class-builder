import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // console.log("middleware" + request.url);
  return NextResponse.rewrite(new URL("/api/asset-link", request.url));

  // return NextResponse.rewrite('' );

  // return NextResponse.redirect(new URL("/login"), request.url);
  // return NextResponse.redirect(new URL("/uwu", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  //match public folder contents
  // public: true,
  matcher: "/.well-known/assetlinks.json",
};
