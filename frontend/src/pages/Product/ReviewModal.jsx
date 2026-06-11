import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { modalContent, modalOverlay } from "../../animations/variants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { reviewService } from "../../services/review.service";

const reviewSchema = z.object({
  rating: z.coerce
    .number({ invalid_type_error: "Chọn số sao" })
    .int()
    .min(1, "Chọn ít nhất 1 sao")
    .max(5),
  comment: z
    .string()
    .max(1000, "Tối đa 1000 ký tự")
    .optional()
    .or(z.literal("")),
});

export default function ReviewModal({ productId, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const selectedRating = watch("rating");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await reviewService.create(productId, data);
      toast.success("Đánh giá của bạn đã được ghi nhận!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra, thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      {...modalOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        {...modalContent}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="font-heading text-base font-bold uppercase tracking-widest text-[#2f2f2e]">
            POST YOUR FIT
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#5c5b5b] transition hover:bg-[#f3f0ef]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() =>
                    setValue("rating", star, { shouldValidate: true })
                  }
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= (hoverRating || selectedRating)
                        ? "fill-[#fbbf24] text-[#fbbf24]"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>
            )}
            <input type="hidden" {...register("rating")} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
              Nhận xét (tuỳ chọn)
            </label>
            <textarea
              {...register("comment")}
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full resize-none rounded-lg border border-black/15 px-3 py-2.5 text-sm text-[#2f2f2e] outline-none transition focus:border-[#004be3] focus:ring-2 focus:ring-[#004be3]/8"
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-[#2f2f2e] transition hover:bg-[#f3f0ef]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#2f2f2e] px-6 py-2 text-sm font-bold uppercase tracking-widest text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Đăng đánh giá"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
