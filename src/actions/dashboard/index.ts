"use server";

import { BASE_URL } from "@/lib/BaseUrl";
import { cookies } from "next/headers";


export const getDashboardSummary = async () => {
    try {
        // Get access token from cookies
        const accessToken = (await cookies()).get("accessToken")?.value;
        console.log("🟢 Access Token:", accessToken);

        if (!accessToken) {
            console.error("❌ No access token found in cookies");
            return {
                success: false,
                message: "No access token found. Please login again.",
            };
        }

        // Full API URL
        const url = `${BASE_URL}/dashboard/summary`;
        console.log("🟢 Fetching Dashboard Summary from:", url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            next: {
                tags: ["DASHBOARD_SUMMARY"],
            },
        });

        console.log("🟢 Response status:", res.status, res.statusText);

        // Debug response body
        const text = await res.text();
        console.log("🟢 Raw response body:", text);

        // Try parsing JSON if possible
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { success: false, message: text };
        }

        if (!res.ok) {
            console.error("❌ getDashboardSummary failed:", data);
            return {
                success: false,
                message: data.message || `Failed to fetch dashboard summary: ${res.status}`,
            };
        }

        return data;
    } catch (error: any) {
        console.error("❌ getDashboardSummary Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while fetching dashboard summary",
        };
    }
};


export const getRecentActivityLogs = async (limit = 8) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found. Please login again.",
            };
        }

        const url = `${BASE_URL}/dashboard/recent-activity-logs?limit=${limit}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            next: {
                tags: ["RECENT_ACTIVITY_LOGS"],
            },
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { success: false, message: text || "Invalid response format" };
        }

        if (!res.ok) {
            return {
                success: false,
                message: data.message || `Failed to fetch activity logs: ${res.status}`,
            };
        }

        // Assuming your API returns something like: { success: true, data: [...] }
        return {
            success: true,
            data: data.data || data || [],
        };
    } catch (error: any) {
        console.error("getRecentActivityLogs error:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch recent activity logs",
        };
    }
};