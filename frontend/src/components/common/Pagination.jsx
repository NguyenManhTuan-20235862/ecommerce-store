export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-neutral-700">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
