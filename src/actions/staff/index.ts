"use server";

import { BASE_URL } from "@/lib/BaseUrl";
import { cookies } from "next/headers";

// Get all staff members
export const getAllStaff = async (page = 1, limit = 25) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            console.error("❌ No access token found in cookies");
            return {
                success: false,
                message: "No access token found. Please login again.",
            };
        }

        const url = `${BASE_URL}/staff?type=my_staff&page=${page}&limit=${limit}`;
        console.log("🟢 Fetching Staff from:", url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            next: {
                tags: ["STAFF_LIST"],
            },
        });

        console.log("🟢 Response status:", res.status, res.statusText);

        const text = await res.text();
        console.log("🟢 Raw response body:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { success: false, message: text };
        }

        if (!res.ok) {
            console.error("❌ getAllStaff failed:", data);
            return {
                success: false,
                message: data.message || `Failed to fetch staff: ${res.status}`,
            };
        }

        return data;
    } catch (error: any) {
        console.error("❌ getAllStaff Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while fetching staff",
        };
    }
};

// Create new staff member
export const createStaff = async (staffData: {
    name: string;
    serviceType: string;
    dailyCapacity: number;
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

        const url = `${BASE_URL}/staff`;
        console.log("🟢 Creating Staff at:", url);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(staffData),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { success: false, message: text };
        }

        if (!res.ok) {
            console.error("❌ createStaff failed:", data);
            return {
                success: false,
                message: data.message || `Failed to create staff: ${res.status}`,
            };
        }

        return data;
    } catch (error: any) {
        console.error("❌ createStaff Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while creating staff",
        };
    }
};

// Update staff status
export const updateStaffStatus = async (
    staffId: string,
    status: "Available" | "OnLeave"
) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found. Please login again.",
            };
        }

        const url = `${BASE_URL}/staff/${staffId}/status`;
        console.log("🟢 Updating Staff Status at:", url);

        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status }),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { success: false, message: text };
        }

        if (!res.ok) {
            console.error("❌ updateStaffStatus failed:", data);
            return {
                success: false,
                message: data.message || `Failed to update staff status: ${res.status}`,
            };
        }

        return data;
    } catch (error: any) {
        console.error("❌ updateStaffStatus Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while updating staff status",
        };
    }
};

// Get all services (to show staff load)
export const getAllServices = async (limit = 1000) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found. Please login again.",
            };
        }

        const url = `${BASE_URL}/services?type=my_services&limit=${limit}`;
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