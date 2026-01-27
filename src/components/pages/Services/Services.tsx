"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "./Header";
import ServicesTable from "./ServicesTable";
import { getAllServices, deleteService } from "@/actions/services";
import { IService } from "@/types/service";
import ServiceSkeleton from "./ServiceSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Services() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [services, setServices] = useState<IService[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const limit = 6;
  const [loading, setLoading] = useState(false);

  const fetchServices = async (pageNumber = 1) => {
    setLoading(true);
    const res = await getAllServices(pageNumber, limit);

    if (res?.success) {
      setServices(res.data);
      setMeta(res.meta);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchServices(page);
  }, [page]);

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const res = await deleteService(deleteId);
    if (res?.success) {
      fetchServices(page);
    }

    setDeleteId(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Header />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {loading &&
            [1, 2, 3, 4, 5, 6].map((i) => <ServiceSkeleton key={i} />)}
          {!loading &&
            services.map((service) => (
              <Card key={service.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="w-4 h-4" />
                    <span>
                      Duration:{" "}
                      <strong>{service.durationMinutes} minutes</strong>
                    </span>
                  </div>

                  <div>
                    Required Staff: <strong>{service.requiredStaffType}</strong>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive"
                      onClick={() => openDeleteModal(service.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Pagination */}
        {page > 1 && (
          <div className="flex justify-center items-center gap-4 my-6">
            <Button
              disabled={!meta.hasPrevPage}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span>
              Page {meta.page} of {meta.totalPages}
            </span>

            <Button
              disabled={!meta.hasNextPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Table View */}
        {/* <ServicesTable services={services} /> */}
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This service will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
