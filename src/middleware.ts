import { NextResponse, NextRequest } from "next/server";
import { isJwtExpired } from "./utils/utils";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token && !isJwtExpired(token)) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/quiz"],
};
