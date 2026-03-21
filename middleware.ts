import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "lifesum_session";
const AUTH_PAGES = ["/login", "/register"];
const PRIVATE_PATHS = ["/dashboard", "/analytics", "/profile", "/meals"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = await hasValidSession(request);

  if (isPrivatePath(pathname) && !loggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage(pathname) && loggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/profile/:path*", "/meals/:path*", "/login", "/register"],
};
