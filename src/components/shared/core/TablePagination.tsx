"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[]; // default: [5, 10, 20, 50]
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm">
      {/* Left: Showing X-Y of Z */}
      <div className="text-muted-foreground">
        Showing{" "}
        <span className="font-medium">
          {totalItems === 0 ? 0 : startItem}–{totalItems === 0 ? 0 : endItem}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => (
          <Button
            key={idx}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`h-9 w-9 p-0 ${page === "..." ? "cursor-default" : ""}`}
          >
            {page}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Page Size Selector using Shadcn Select */}
        {onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

// Example usage

//   <TablePagination
//     currentPage={meta.page}
//     totalPages={meta.totalPage}
//     pageSize={limit} // আপনার state থেকে যেটা limit (যেমন 10)
//     totalItems={meta.total} // আপনার state থেকে যেটা total
//     onPageChange={(page) => setCurrentPage(page)}
//     // optional: page size change চাইলে
//     // onPageSizeChange={(size) => {
//     //   setLimit(size);
//     //   setCurrentPage(1);
//     // }}
//     // pageSizeOptions={[5, 10, 20, 50]}
//   />;
