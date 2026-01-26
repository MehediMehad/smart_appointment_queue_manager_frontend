import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { roleRoutes } from "@/lib/roleRoutes";
import { TUserPayload } from "./types/auth";

const AUTH_COOKIE_NAME = "accessToken";

export function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    const PUBLIC_ROUTES = ["/", "/signup", "/unauthorized"];

    // ✅ Allow public & static routes
    if (
        PUBLIC_ROUTES.includes(pathname) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico")
    ) {
        // Logged-in user should NOT stay on login/signup
        if (token && (pathname === "/" || pathname === "/signup")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // ❌ Not logged in → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Decode token
    let decoded: TUserPayload;
    try {
        decoded = jwtDecode<TUserPayload>(token);
    } catch {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = decoded.role;

    // Role based access
    for (const routePrefix in roleRoutes) {
        if (pathname.startsWith(routePrefix)) {
            if (!roleRoutes[routePrefix].includes(role)) {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
