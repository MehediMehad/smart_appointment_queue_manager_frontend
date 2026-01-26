import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { roleRoutes } from "@/lib/roleRoutes";
import { TUserPayload } from "./types/auth";

const AUTH_COOKIE_NAME = "accessToken";

export function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const PUBLIC = ["/login", "/signup", "/favicon.ico", "/unauthorized"];
    const AUTH_PAGES = ["/login", "/signup"];

    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    console.log({ pathname });


    // Logged-in user trying to access login/signup → redirect home
    if (token && AUTH_PAGES.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Access Public pages or static files → allow
    if (
        PUBLIC.includes(pathname) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    // Non - logged -in user trying to access protected page → login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Token decode
    let decoded: TUserPayload | null = null;

    try {
        decoded = jwtDecode<TUserPayload>(token);
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = decoded.role;

    // Role-based access control
    for (const routePrefix in roleRoutes) {
        if (pathname.startsWith(routePrefix)) {
            const allowed = roleRoutes[routePrefix];
            if (!allowed.includes(role)) {
                // Redirect to unauthorized page 
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|api|favicon.ico|static).*)",
    ],
};
