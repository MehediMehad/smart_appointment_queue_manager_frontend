export type TStaff = {
    id: string;
    name: string;
    serviceType: string;
    dailyCapacity: number;
    status: "Available" | "OnLeave";
    createdAt: string;
};

export type TStaffMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};