import { Search, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function CategoryControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full max-w-sm flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full border-b-2 border-black/10 bg-transparent py-2 pl-11 pr-10 text-sm font-medium text-[#2f2f2e] placeholder-[#94a3b8] outline-none transition focus:border-[#004be3]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#2f2f2e]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sort */}
      <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
        SORT BY:
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border-b-2 border-[#004be3] bg-transparent pb-1 text-xs font-bold uppercase tracking-widest text-[#0f172a] outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
