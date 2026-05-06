import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router";

/**
 * Checkout Success Page
 * Hiển thị sau khi đặt hàng thành công
 */
export default function CheckoutSuccess() {
  const { orderNumber } = useParams();

  return (
    <section className="min-h-screen bg-[#f9f6f5] px-4 py-20">
      <div className="mx-auto w-full max-w-2xl">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-green-600 shadow-lg">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <h1 className="font-heading text-4xl font-extrabold uppercase tracking-[-0.04em] text-[#2f2f2e] md:text-5xl">
            Đặt hàng thành công!
          </h1>
          <p className="mt-4 text-lg text-[#5c5b5b]">
            Cảm ơn bạn đã mua sắm tại Vibe Urban
          </p>
        </div>

        {/* Order Number */}
        {orderNumber && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-[#004be3]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
                  Mã đơn hàng
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[#2f2f2e]">
                  {orderNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 rounded-2xl bg-[#f3f0ef] p-6">
          <p className="text-sm text-[#5c5b5b]">
            Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.
            Bạn có thể theo dõi trạng thái đơn hàng trong trang{" "}
            <Link
              to="/profile/orders"
              className="font-semibold text-[#004be3] underline"
            >
              Lịch sử đơn hàng
            </Link>
            .
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to={`/profile/orders/${orderNumber}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-[#004be3] bg-white px-6 text-base font-bold uppercase tracking-[-0.02em] text-[#004be3] transition hover:bg-[#004be3] hover:text-white"
          >
            <Package className="h-5 w-5" />
            Xem đơn hàng
          </Link>

          <Link
            to="/shop"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 text-base font-bold uppercase tracking-[-0.02em] text-white shadow-[0_10px_20px_rgba(0,75,227,0.2)] transition hover:shadow-[0_15px_30px_rgba(0,75,227,0.3)]"
          >
            <ShoppingBag className="h-5 w-5" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5c5b5b]/60">
            Cần hỗ trợ? Liên hệ{" "}
            <a
              href="mailto:support@vibeurban.vn"
              className="text-[#004be3] underline"
            >
              support@vibeurban.vn
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
