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

    if (result.success) {
      (await cookies()).set({
        name: AUTH_COOKIE_NAME,
        value: result.data.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return result;
  } catch (error: any) {
    console.error("Signup Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
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

    if (result.success) {
      (await cookies()).set({
        name: AUTH_COOKIE_NAME,
        value: result.data.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return result;
  } catch (error: any) {
    console.error("Login Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
};

export const getAuthAction = async (): Promise<TUserPayload | null> => {
  try {
    const accessToken = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    if (!accessToken) return null;
    return jwtDecode<TUserPayload>(accessToken);
  } catch (error) {
    console.error("getAuthAction Error:", error);
    return null;
  }
};

export const logoutAction = async () => {
  (await cookies()).delete(AUTH_COOKIE_NAME);
};
