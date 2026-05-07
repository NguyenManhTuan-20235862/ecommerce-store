import { orderService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import CheckoutProgress from "./components/CheckoutProgress";
import ShippingDeploymentForm from "./components/ShippingDeploymentForm";
import { checkoutSchema } from "./schemas";
import {
    calculateFinalAmount,
    calculateShippingFee,
    calculateSubtotal,
    formatVnd,
    transformToOrderPayload,
} from "./utils";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, fetchCart, isLoading: cartLoading, couponCode: appliedCouponCode, couponDiscount } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form với Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      receiverName: user?.displayName || "",
      receiverPhone: user?.phone || "",
      receiverEmail: user?.email || "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      paymentMethod: "COD",
      couponCode: appliedCouponCode || "",
    },
  });

  // Tính toán giá tiền
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const shippingFee = useMemo(() => calculateShippingFee(subtotal), [subtotal]);
  const total = useMemo(
    () => calculateFinalAmount(subtotal, shippingFee, couponDiscount),
    [subtotal, shippingFee, couponDiscount]
  );

  // Redirect nếu giỏ hàng rỗng (chờ load xong mới kiểm tra)
  useEffect(() => {
    if (!cartLoading && (!items || items.length === 0)) {
      toast.error("Giỏ hàng trống, vui lòng thêm sản phẩm");
      navigate("/cart");
    }
  }, [items, cartLoading, navigate]);

  // Submit form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Transform data thành payload
      const payload = transformToOrderPayload(data);

      // Gọi API tạo đơn hàng
      const response = await orderService.createOrder(payload);

      if (response.data?.success) {
        const orderNumber = response.data.data?.orderNumber;

        // Đồng bộ giỏ hàng từ server (backend đã clear cart)
        await fetchCart();

        // Hiển thị thông báo thành công
        toast.success("Đặt hàng thành công!");

        // Redirect đến trang success
        navigate(`/checkout/success/${orderNumber}`);
      } else {
        throw new Error(response.data?.message || "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      // Xử lý lỗi cụ thể
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đặt hàng";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chờ cart load hoặc giỏ hàng rỗng, không render gì
  if (cartLoading || !items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f9f6f5] px-4 pb-10 pt-6 sm:px-6 lg:px-6 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <CheckoutProgress />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column - Form */}
            <div className="space-y-12 lg:col-span-7">
              <ShippingDeploymentForm
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            </div>

            {/* Right Column - Order Summary */}
            <aside className="lg:col-span-5">
              <div className="rounded-3xl bg-[#f3f0ef] p-8 shadow-sm lg:sticky lg:top-24">
                <h3 className="font-heading text-3xl font-extrabold uppercase tracking-[-0.04em] text-[#2f2f2e]">
                  Đơn hàng
                </h3>

                {/* Items List */}
                <div className="mt-8 space-y-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-[#dfdcdc]">
                        <img
                          src={item.productImage || "/placeholder.png"}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold uppercase text-[#2f2f2e]">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-[#5c5b5b]">
                          SIZE: {item.selectedSize} | MÀU: {item.selectedColor} | SL: {item.quantity}
                        </p>
                        <p className="mt-1 text-xl font-extrabold text-[#004be3]">
                          {formatVnd(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="mt-8 border-t border-black/10 pt-8">
                  <div className="space-y-4 text-sm font-semibold uppercase tracking-widest text-[#5c5b5b]">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="text-base normal-case tracking-normal">
                        {formatVnd(subtotal)}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Giảm giá {appliedCouponCode && `(${appliedCouponCode})`}</span>
                        <span className="text-base normal-case tracking-normal">
                          −{formatVnd(couponDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span className="text-base normal-case tracking-normal">
                        {shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-black/10 pt-4">
                    <p className="font-heading text-3xl font-extrabold uppercase leading-tight tracking-[-0.03em] text-[#2f2f2e]">
                      Tổng cộng
                    </p>
                    <p className="whitespace-nowrap font-heading text-[34px] font-extrabold text-[#004be3]">
                      {formatVnd(total)}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex h-17 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 text-lg font-extrabold uppercase tracking-[-0.02em] text-white shadow-[0_10px_20px_rgba(0,75,227,0.2)] transition hover:shadow-[0_15px_30px_rgba(0,75,227,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Đặt hàng
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c5b5b]/60">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản của chúng tôi
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}
