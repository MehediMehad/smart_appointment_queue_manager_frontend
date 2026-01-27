"use server";

import { BASE_URL } from "@/lib/BaseUrl";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const getAllServices = async (page = 1, limit = 10) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please login again.",
      };
    }

    const url = `${BASE_URL}/services?type=my_services&page=${page}&limit=${limit}`;
    console.log("🟢 Fetching Services from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["SERVICES_LIST"],
      },
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }

    if (!res.ok) {
      console.error("❌ getAllServices failed:", data);
      return {
        success: false,
        message: data.message || `Failed to fetch services: ${res.status}`,
      };
    }

    return data;
  } catch (error: any) {
    console.error("❌ getAllServices Error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong while fetching services",
    };
  }
};

export const deleteService = async (id: string) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please login again.",
      };
    }

    const url = `${BASE_URL}/services/${id}`;
    console.log("🟢 Deleting Service at:", url);

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }

    if (!res.ok) {
      console.error("❌ deleteService failed:", data);
      return {
        success: false,
        message: data.message || `Failed to delete service: ${res.status}`,
      };
    }

    revalidateTag("SERVICES_LIST", "page");

    return data;
  } catch (error: any) {
    console.error("❌ deleteService Error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong while deleting service",
    };
  }
};
