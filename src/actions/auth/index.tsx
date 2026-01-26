"use server";
import { BASE_URL } from "@/lib/BaseUrl";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { TUserPayload } from "@/types/auth";

const AUTH_COOKIE_NAME = "accessToken";

export const signupAction = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    const storeCookies = await cookies();

    if (result.success) {
      storeCookies.set({
        name: AUTH_COOKIE_NAME,
        value: result.data.accessToken,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};

export const loginAction = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    const storeCookies = await cookies();

    if (result.success) {
      storeCookies.set({
        name: AUTH_COOKIE_NAME,
        value: result.data.accessToken,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};

export const getAuthAction = async (): Promise<TUserPayload | null> => {
  const storeCookies = await cookies();
  const accessToken = storeCookies.get(AUTH_COOKIE_NAME)?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const logoutAction = async () => {
  const storeCookies = await cookies();
  storeCookies.delete(AUTH_COOKIE_NAME);
};
