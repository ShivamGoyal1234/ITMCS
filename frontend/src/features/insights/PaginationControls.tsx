import { memo } from "react";
import type { Pagination } from "../../api/types";

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

function PaginationControlsImpl({ pagination, onPageChange }: PaginationControlsProps) {
  const { page, totalPages, total } = pagination;

  return (
    <div className="pagination-controls">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages} ({total} insights)
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export const PaginationControls = memo(PaginationControlsImpl);
