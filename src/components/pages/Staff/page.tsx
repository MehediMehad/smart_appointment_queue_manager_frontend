"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { NMTable } from "@/components/shared/core/NMTable";
import { TablePagination } from "@/components/shared/core/TablePagination";
import { TStaff, TStaffMeta } from "@/types";
import { getAllStaff, updateStaffStatus } from "@/actions/staff";

import Sidebar from "@/components/layout/Sidebar";
import dynamic from "next/dynamic";
import StaffCreateForm from "./StaffCreateForm"; // ← New Component

const ConfirmStaffStatusChangeModal = dynamic(
  () => import("./ConfirmStaffStatusChangeModal"),
);

type ConfirmModalState = {
  isOpen: boolean;
  staffId: string | null;
  currentStatus: "Available" | "OnLeave" | null;
};

const StaffManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [staffData, setStaffData] = useState<TStaff[]>([]);
  const [meta, setMeta] = useState<TStaffMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    staffId: null,
    currentStatus: null,
  });

  const openConfirmModal = (staff: TStaff) => {
    setConfirmModal({
      isOpen: true,
      staffId: staff.id,
      currentStatus: staff.status,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, staffId: null, currentStatus: null });
  };

  const confirmStatusChange = async () => {
    if (!confirmModal.staffId || !confirmModal.currentStatus) return;

    const newStatus =
      confirmModal.currentStatus === "Available" ? "OnLeave" : "Available";

    try {
      await updateStaffStatus(confirmModal.staffId, newStatus);
      toast.success(`Staff status changed to ${newStatus}`);
      fetchStaffs();
    } catch (error) {
      console.error("Status change failed:", error);
      toast.error("Failed to change staff status.");
    } finally {
      closeConfirmModal();
    }
  };

  const columns: ColumnDef<TStaff>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "serviceType", header: "Service Type" },
    { accessorKey: "dailyCapacity", header: "Daily Capacity" },
    {
      accessorKey: "createdAt",
      header: "Join Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          status === "Available"
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800";

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Change Status",
      cell: ({ row }) => (
        <button
          className="p-2 rounded-md transition bg-gray-200 hover:bg-gray-300 text-gray-900"
          onClick={() => openConfirmModal(row.original)}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const fetchStaffs = async () => {
    try {
      const result = await getAllStaff({ page: currentPage, limit });
      setStaffData(result.data || []);
      setMeta(result.meta || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch staffs.");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [currentPage, limit]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="w-full flex-1 overflow-auto p-8">
        {/* Header with Add Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your team and their availability
            </p>
          </div>

          <StaffCreateForm onSuccess={fetchStaffs} />
        </div>

        {/* Table */}
        <NMTable columns={columns} data={staffData} />

        {/* Pagination */}
        {meta.total > 0 && (
          <TablePagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            pageSize={meta.limit}
            totalItems={meta.total}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setLimit(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmStaffStatusChangeModal
          modalState={confirmModal}
          onClose={closeConfirmModal}
          onConfirm={confirmStatusChange}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
