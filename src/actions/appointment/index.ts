"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/BaseUrl";

// List / Filter
export async function getAppointments(params: {
    page?: number;
    limit?: number;
    date?: string; // YYYY-MM-DD
    staffId?: string;
    status?: string;
    searchTerm?: string;
}) {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.date) query.set("date", params.date);
    if (params.staffId) query.set("staffId", params.staffId);
    if (params.status) query.set("status", params.status);
    if (params.searchTerm) query.set("searchTerm", params.searchTerm);

    const res = await fetch(`${BASE_URL}/appointments?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return data;
}

// Create
export async function createAppointment(formData: FormData) {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return await res.json();
}

// Update (edit / cancel)
export async function updateAppointment(id: string, data: any) {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return await res.json();
}

// Delete / Cancel
export async function cancelAppointment(id: string) {
    return updateAppointment(id, { status: "Cancelled" });
    // অথবা DELETE করতে চাইলে method: "DELETE" করো
}