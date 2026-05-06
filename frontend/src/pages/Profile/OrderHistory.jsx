import { orderService } from "@/services";
import { Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

/**
 * Format ngày tháng
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Format tiền VNĐ
 */
const formatVnd = (value) => {
  if (typeof value !== "number") return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

/**
 * Badge màu sắc theo trạng thái
 */
const getStatusBadge = (status) => {
  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      className: "bg-yellow-100 text-yellow-700",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-100 text-blue-700",
    },
    shipping: {
      label: "Đang giao",
      className: "bg-purple-100 text-purple-700",
    },
    delivered: {
      label: "Đã giao",
      className: "bg-green-100 text-green-700",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-700",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
};

/**
 * Order History Page
 * Hiển thị danh sách đơn hàng của user
 */
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await orderService.getUserOrders();

      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        throw new Error(response.data?.message || "Không thể tải đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi tải đơn hàng";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 rounded-xl bg-[#f3f0ef]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 rounded-full bg-[#004be3] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0039b3]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f0ef]">
          <Package className="h-10 w-10 text-[#5c5b5b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#2f2f2e]">
          Chưa có đơn hàng nào
        </h2>
        <p className="mt-2 text-[#5c5b5b]">
          Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 py-3 text-sm font-bold uppercase text-white shadow-[0_10px_20px_rgba(0,75,227,0.2)] transition hover:shadow-[0_15px_30px_rgba(0,75,227,0.3)]"
        >
          <ShoppingBag className="h-5 w-5" />
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  // Orders list
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#2f2f2e]">
          Đơn hàng của tôi ({orders.length})
        </h2>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/profile/orders/${order._id}`}
            className="block rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {/* Order Number */}
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-[#004be3]" />
                  <p className="font-mono text-lg font-bold text-[#2f2f2e]">
                    {order.orderNumber}
                  </p>
                </div>

                {/* Date */}
                <p className="mt-2 text-sm text-[#5c5b5b]">
                  Đặt ngày: {formatDate(order.createdAt)}
                </p>

                {/* Items count */}
                <p className="mt-1 text-sm text-[#5c5b5b]">
                  {order.items?.length || 0} sản phẩm
                </p>
              </div>

              <div className="text-right">
                {/* Status Badge */}
                <div className="mb-3">{getStatusBadge(order.status)}</div>

                {/* Total Amount */}
                <p className="text-2xl font-extrabold text-[#004be3]">
                  {formatVnd(order.finalAmount)}
                </p>
              </div>
            </div>

            {/* Items Preview */}
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {order.items?.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f3f0ef]"
                >
                  <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {order.items?.length > 4 && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f3f0ef] text-sm font-semibold text-[#5c5b5b]">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
