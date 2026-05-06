import { orderService } from "@/services";
import { ArrowLeft, Loader2, MapPin, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
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
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
};

/**
 * Order Detail Page
 * Hiển thị chi tiết một đơn hàng
 */
export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await orderService.getOrderById(orderId);

      if (response.data?.success) {
        setOrder(response.data.data);
      } else {
        throw new Error(response.data?.message || "Không thể tải đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
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

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setIsCancelling(true);

      const response = await orderService.cancelOrder(orderId);

      if (response.data?.success) {
        toast.success("Hủy đơn hàng thành công");
        // Cập nhật order state
        setOrder((prev) => ({
          ...prev,
          status: "cancelled",
        }));
      } else {
        throw new Error(response.data?.message || "Không thể hủy đơn hàng");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi hủy đơn hàng";
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[#f3f0ef]"></div>
          <div className="h-32 rounded-xl bg-[#f3f0ef]"></div>
          <div className="h-32 rounded-xl bg-[#f3f0ef]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-red-500">{error || "Không tìm thấy đơn hàng"}</p>
        <Link
          to="/profile/orders"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#004be3] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0039b3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const canCancel = order.status === "pending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to="/profile/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#004be3] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Link>
            <div className="mt-4 flex items-center gap-3">
              <Package className="h-6 w-6 text-[#004be3]" />
              <h1 className="font-mono text-2xl font-bold text-[#2f2f2e]">
                {order.orderNumber}
              </h1>
            </div>
            <p className="mt-2 text-sm text-[#5c5b5b]">
              Đặt ngày: {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-right">
            {getStatusBadge(order.status)}
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Hủy đơn hàng
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Items & Shipping */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items List */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2f2f2e]">
              Sản phẩm ({order.items?.length || 0})
            </h2>

            <div className="mt-6 space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f3f0ef]">
                    <img
                      src={item.productImage || "/placeholder.png"}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2f2f2e]">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm text-[#5c5b5b]">
                      Size: {item.selectedSize} | Màu: {item.selectedColor}
                    </p>
                    <p className="mt-1 text-sm text-[#5c5b5b]">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#004be3]">
                      {formatVnd(item.price * item.quantity)}
                    </p>
                    <p className="mt-1 text-xs text-[#5c5b5b]">
                      {formatVnd(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#004be3]" />
              <h2 className="text-xl font-bold text-[#2f2f2e]">
                Địa chỉ giao hàng
              </h2>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[#5c5b5b]">
              <p className="font-semibold text-[#2f2f2e]">
                {order.shippingAddress?.receiverName}
              </p>
              <p>{order.shippingAddress?.receiverPhone}</p>
              <p>{order.shippingAddress?.receiverEmail}</p>
              <p className="mt-3">
                {order.shippingAddress?.detail}
                <br />
                {order.shippingAddress?.ward}, {order.shippingAddress?.district}
                <br />
                {order.shippingAddress?.province}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-[#f3f0ef] p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-[#2f2f2e]">Tổng quan</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5c5b5b]">Tạm tính</span>
                <span className="font-semibold text-[#2f2f2e]">
                  {formatVnd(order.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5c5b5b]">Phí vận chuyển</span>
                <span className="font-semibold text-[#2f2f2e]">
                  {order.shippingFee === 0
                    ? "Miễn phí"
                    : formatVnd(order.shippingFee)}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#5c5b5b]">Giảm giá</span>
                  <span className="font-semibold text-green-600">
                    -{formatVnd(order.discountAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-black/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-[#2f2f2e]">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-extrabold text-[#004be3]">
                    {formatVnd(order.finalAmount)}
                  </span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4">
                <p className="text-xs text-[#5c5b5b]">
                  <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                  {order.paymentMethod}
                </p>
                {order.couponCode && (
                  <p className="mt-2 text-xs text-[#5c5b5b]">
                    <span className="font-semibold">Mã giảm giá:</span>{" "}
                    {order.couponCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
