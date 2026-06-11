import { Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ReviewModal from "./ReviewModal";

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= rating ? "fill-[#fbbf24] text-[#fbbf24]" : "fill-[#e4e2e1] text-[#e4e2e1]"
          }`}
        />
      ))}
    </div>
  );
}

export default function VibeCheckReviews({
  reviews,
  productId,
  isAuthenticated,
  onReviewSubmitted,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const handlePostFit = () => {
    if (!isAuthenticated) {
      toast.info("Đăng nhập để đánh giá sản phẩm");
      navigate("/login");
      return;
    }
    setModalOpen(true);
  };

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="m-0 font-heading text-5xl font-italic italic tracking-tight text-[#2f2f2e]">
            VIBE CHECK
          </h2>
          <p className="mt-2 text-base text-[#5c5b5b]">
            REAL PULSE FROM OUR COMMUNITY
          </p>
        </div>
        <button
          onClick={handlePostFit}
          className="rounded-full bg-[#2f2f2e] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#f9f6f5] transition hover:brightness-125"
        >
          POST YOUR FIT
        </button>
      </div>

      {safeReviews.length === 0 ? (
        <div className="rounded-2xl bg-[#f3f0ef] p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#5c5b5b]">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
          <p className="mt-2 text-xs text-[#5c5b5b]">
            Hãy là người đầu tiên chia sẻ trải nghiệm!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeReviews.map((review) => (
            <div
              key={review.id}
              className="space-y-3 rounded-2xl bg-[#f3f0ef] p-6"
            >
              <StarRow rating={review.rating} />
              {review.text && (
                <p className="text-sm font-bold leading-relaxed text-[#2f2f2e]">
                  &ldquo;{review.text}&rdquo;
                </p>
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
                {review.author}
                {review.verified && (
                  <span className="ml-2 text-[#004be3]">• VERIFIED PULSE</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ReviewModal
          productId={productId}
          onClose={() => setModalOpen(false)}
          onSuccess={onReviewSubmitted}
        />
      )}
    </section>
  );
}
