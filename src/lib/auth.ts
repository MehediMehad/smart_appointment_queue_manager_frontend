import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import { cookies } from "next/headers";
import { BASE_URL } from "./BaseUrl";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            console.log({ user, account });

            if (!user.email) return false;
            if (!account) return false;

            try {
                const res = await fetch(`${BASE_URL}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        provider: account.provider,
                        providerId: account.providerAccountId,
                    }),
                });

                const result = await res.json();

                const storeCookies = await cookies();

                if (result?.success) {
                    storeCookies.set({
                        name: 'accessToken',
                        value: result.data.accessToken,
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                    });
                }

                return result;
            } catch (err) {
                console.error("⚠️", err);
                return false;
            }
        },
    },
});