import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { drawerSlideIn, fadeInItem, fadeUpItem, modalOverlay, staggerContainer } from "../../../animations/variants";
import { userService } from "../../../services/user.service";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const PAGE_SIZE = 10;

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search + reset page khi query đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await userService.getAllUsers({
          search: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setUsers(res.data.users || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
          setTotal(res.data.pagination?.total || 0);
        }
      } catch {
        if (!cancelled) toast.error("Không thể tải danh sách khách hàng");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUsers();
    return () => { cancelled = true; };
  }, [page, debouncedSearch]);

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUpItem} initial="initial" animate="animate" className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Quản lý khách hàng
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {loading ? "Đang tải..." : `${total} tài khoản trong hệ thống`}
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeInItem} initial="initial" animate="animate" transition={{ delay: 0.06 }} className="mb-4">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInItem} initial="initial" animate="animate" transition={{ delay: 0.1 }} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Khách hàng
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Username
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Số điện thoại
                </th>
                <th className="px-4 py-3 text-center font-medium text-neutral-500">
                  Vai trò
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Ngày tham gia
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <motion.tbody
              key={`${users[0]?._id ?? 'empty'}-${users.length}-${page}`}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    {debouncedSearch
                      ? "Không tìm thấy tài khoản nào"
                      : "Chưa có tài khoản nào"}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user._id}
                    variants={fadeInItem}
                    className="cursor-pointer border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* Avatar + Tên */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.displayName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-neutral-400" />
                          )}
                        </div>
                        <span className="font-medium text-neutral-900">
                          {user.displayName}
                        </span>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-500">
                        {user.username}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-neutral-600">{user.email}</td>

                    {/* SĐT */}
                    <td className="px-4 py-3 text-neutral-500">
                      {user.phone || <span className="text-neutral-300">—</span>}
                    </td>

                    {/* Vai trò */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Khách hàng"}
                      </span>
                    </td>

                    {/* Ngày tham gia */}
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Chi tiết button */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-neutral-400 hover:text-neutral-600">
                        Xem →
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <p className="text-xs text-neutral-500">
              Trang {page} / {totalPages} ({total} tài khoản)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    n === page
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Drawer */}
      <AnimatePresence>
      {selectedUser && (
        <motion.div
          {...modalOverlay}
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedUser(null)
          }
        >
          <motion.div {...drawerSlideIn} className="h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                Thông tin tài khoản
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Avatar + Tên */}
              <div className="flex flex-col items-center gap-3 pt-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100">
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-neutral-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-neutral-900">
                    {selectedUser.displayName}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedUser.role === "admin"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {selectedUser.role === "admin" ? "Admin" : "Khách hàng"}
                  </span>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-400">Username</span>
                  <span className="font-mono font-medium text-neutral-700">
                    {selectedUser.username}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-400">Email</span>
                  <span className="font-medium text-neutral-700">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-400">Số điện thoại</span>
                  <span className="font-medium text-neutral-700">
                    {selectedUser.phone || "—"}
                  </span>
                </div>
                {selectedUser.bio && (
                  <div className="border-b border-neutral-100 pb-3">
                    <p className="mb-1 text-neutral-400">Bio</p>
                    <p className="text-neutral-700">{selectedUser.bio}</p>
                  </div>
                )}
                <div className="flex justify-between pb-3">
                  <span className="text-neutral-400">Tham gia</span>
                  <span className="font-medium text-neutral-700">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
