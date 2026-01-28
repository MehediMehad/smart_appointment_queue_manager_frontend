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

export const createService = async (serviceData: {
  name: string;
  requiredStaffType: string;
  durationMinutes: number;
  status: "Available" | "OnLeave";
}) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please login again.",
      };
    }

    const url = `${BASE_URL}/services`;
    console.log("🟢 Creating Service at:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(serviceData),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }

    if (!res.ok) {
      console.error("❌ createService failed:", data);
      return {
        success: false,
        message: data.message || `Failed to create service: ${res.status}`,
      };
    }

    revalidateTag("SERVICES_LIST", "page");

    return data;
  } catch (error: any) {
    console.error("❌ createService Error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong while creating service",
    };
  }
};

export const updateService = async (id: string, serviceData: any) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please login again.",
      };
    }

    const url = `${BASE_URL}/services/${id}`;
    console.log("🟢 Updating Service at:", url);

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(serviceData),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }

    if (!res.ok) {
      console.error("❌ updateService failed:", data);
      return {
        success: false,
        message: data.message || `Failed to update service: ${res.status}`,
      };
    }

    revalidateTag("SERVICES_LIST", "page");

    return data;
  } catch (error: any) {
    console.error("❌ updateService Error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong while updating service",
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
