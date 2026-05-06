import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { orderService } from "../../../services/order.service";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  shipping: "bg-purple-50 text-purple-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

const FILTER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const isFinalStatus = (status) =>
    status === "cancelled" || status === "delivered";

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const countByStatus = (status) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Quản lý đơn hàng
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {loading ? "Đang tải..." : `${orders.length} đơn hàng trong hệ thống`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {countByStatus(tab.key)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Mã đơn
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-center font-medium text-neutral-500">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-center font-medium text-neutral-500">
                  Thanh toán
                </th>
                <th className="px-4 py-3 text-center font-medium text-neutral-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50"
                  >
                    {/* Mã đơn */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-neutral-700">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Khách hàng */}
                    <td className="px-4 py-3">
                      <p className="max-w-36 truncate font-medium text-neutral-900">
                        {order.userId?.displayName || "—"}
                      </p>
                      <p className="max-w-36 truncate text-xs text-neutral-400">
                        {order.userId?.email}
                      </p>
                    </td>

                    {/* Thumbnails + số lượng */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="h-8 w-8 overflow-hidden rounded border border-neutral-200 bg-neutral-100"
                          >
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-neutral-200" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-neutral-400">
                            +{order.items.length - 2}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {order.items.length} sản phẩm
                      </p>
                    </td>

                    {/* Tổng tiền */}
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                      {formatVND(order.finalAmount)}
                    </td>

                    {/* Phương thức TT */}
                    <td className="px-4 py-3 text-center">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600">
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Trạng thái — inline select */}
                    <td className="px-4 py-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={
                          updatingId === order._id ||
                          isFinalStatus(order.status)
                        }
                        className={`cursor-pointer rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none ring-0 disabled:cursor-default disabled:opacity-70 ${STATUS_COLORS[order.status]}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Ngày đặt */}
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Xem chi tiết */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                        title="Xem chi tiết"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}
        >
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Chi tiết đơn hàng
                </h2>
                <p className="mt-0.5 font-mono text-xs text-neutral-400">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Trạng thái + cập nhật */}
              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Trạng thái đơn hàng
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[selectedOrder.status]}`}
                  >
                    {STATUS_LABELS[selectedOrder.status]}
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder._id, e.target.value)
                    }
                    disabled={
                      updatingId === selectedOrder._id ||
                      isFinalStatus(selectedOrder.status)
                    }
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {isFinalStatus(selectedOrder.status) && (
                  <p className="mt-2 text-xs text-neutral-400">
                    Đơn hàng đã kết thúc, không thể thay đổi trạng thái.
                  </p>
                )}
              </div>

              {/* Thông tin khách hàng */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Khách hàng
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-neutral-900">
                    {selectedOrder.userId?.displayName}
                  </p>
                  <p className="text-neutral-500">{selectedOrder.userId?.email}</p>
                  {selectedOrder.userId?.phone && (
                    <p className="text-neutral-500">
                      {selectedOrder.userId.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Địa chỉ giao hàng
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-neutral-900">
                    {selectedOrder.shippingAddress.receiverName}
                  </p>
                  <p className="text-neutral-500">
                    {selectedOrder.shippingAddress.receiverPhone}
                  </p>
                  <p className="text-neutral-500">
                    {selectedOrder.shippingAddress.receiverEmail}
                  </p>
                  <p className="text-neutral-500">
                    {selectedOrder.shippingAddress.detail},{" "}
                    {selectedOrder.shippingAddress.ward},{" "}
                    {selectedOrder.shippingAddress.district},{" "}
                    {selectedOrder.shippingAddress.province}
                  </p>
                </div>
              </div>

              {/* Sản phẩm */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Sản phẩm ({selectedOrder.items.length})
                </p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {item.selectedSize} · {item.selectedColor} · x
                          {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-neutral-700">
                          {formatVND(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tóm tắt thanh toán */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Tóm tắt
                </p>
                <div className="space-y-1.5 rounded-xl bg-neutral-50 p-4 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính</span>
                    <span>{formatVND(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span>
                      {selectedOrder.shippingFee === 0
                        ? "Miễn phí"
                        : formatVND(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>
                        Giảm giá
                        {selectedOrder.couponCode &&
                          ` (${selectedOrder.couponCode})`}
                      </span>
                      <span>-{formatVND(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold text-neutral-900">
                    <span>Tổng cộng</span>
                    <span>{formatVND(selectedOrder.finalAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-xs text-neutral-400">
                    <span>Phương thức thanh toán</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Thời gian đặt */}
              <p className="text-xs text-neutral-400">
                Đặt lúc: {formatDateTime(selectedOrder.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
