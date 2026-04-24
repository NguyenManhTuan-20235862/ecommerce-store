import { Star } from "lucide-react";

export default function VibeCheckReviews({ reviews }) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const mainReview = safeReviews[0] || null;
  const sideBySide = safeReviews.slice(1, 3);
  const bottomReviews = safeReviews.slice(3);

  if (!mainReview) {
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
          <button className="rounded-full bg-[#2f2f2e] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#f9f6f5]">
            POST YOUR FIT
          </button>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-[#5c5b5b]">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        </div>
      </section>
    );
  }

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
        <button className="rounded-full bg-[#2f2f2e] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#f9f6f5]">
          POST YOUR FIT
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
            ))}
          </div>
          <p className="text-sm font-bold text-[#2f2f2e]">{mainReview.text}</p>
          <p className="text-xs font-bold uppercase text-[#5c5b5b]">
            {mainReview.author} • {mainReview.verified && "VERIFIED PULSE"}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <img
            src={mainReview.image}
            alt={mainReview.author}
            className="h-full w-full object-cover"
          />
        </div>

        {sideBySide.map((review) => (
          <div key={review.id} className="overflow-hidden rounded-2xl">
            <img
              src={review.image}
              alt={review.author}
              className="h-72 w-full object-cover"
            />
          </div>
        ))}

        {bottomReviews.map((review) => (
          <div
            key={review.id}
            className="space-y-4 rounded-2xl bg-white p-8 shadow-sm"
          >
            <div className="flex gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]"
                />
              ))}
            </div>
            {review.text && (
              <p className="text-sm font-bold text-[#2f2f2e]">{review.text}</p>
            )}
            <p className="text-xs font-bold uppercase text-[#5c5b5b]">
              {review.author} • {review.verified && "VERIFIED PULSE"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
