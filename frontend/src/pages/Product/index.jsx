import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { reviewService } from "../../services/review.service";
import { productService } from "../../services/product.service";
import { useAuthStore } from "../../store/authStore";
import { getImageUrl } from "../../utils/getImageUrl";
import { resolveColorHex } from "../../utils/colorMap";
import {
  scrollFadeUp,
  scrollSlideLeft,
  scrollSlideRight,
} from "../../animations/variants";
import ProductDetails from "./ProductDetails";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import VibeCheckReviews from "./VibeCheckReviews";

function mapReviewToDisplay(review) {
  const parts = (review.userId?.displayName || "USER").trim().split(/\s+/);
  const author =
    parts.length === 1
      ? parts[0].toUpperCase()
      : `${parts[parts.length - 2].toUpperCase()} ${parts[parts.length - 1][0].toUpperCase()}.`;
  return {
    id: review._id,
    author,
    verified: review.isVerified,
    rating: review.rating,
    text: review.comment || null,
  };
}

function ProductSkeleton() {
  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 w-20 animate-pulse rounded-2xl bg-[#e4e2e1]"
                />
              ))}
            </div>
            <div className="min-h-[500px] flex-1 animate-pulse rounded-2xl bg-[#e4e2e1]" />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-[#e4e2e1]" />
              <div className="h-6 w-1/3 animate-pulse rounded-lg bg-[#e4e2e1]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[#e4e2e1]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#e4e2e1]" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-[#e4e2e1]" />
            </div>
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 animate-pulse rounded-full bg-[#e4e2e1]"
                />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-[#e4e2e1]" />
              ))}
            </div>
            <div className="h-14 animate-pulse rounded-full bg-[#e4e2e1]" />
            <div className="h-14 animate-pulse rounded-full bg-[#e4e2e1]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fetchReviews = async (pid) => {
    try {
      const res = await reviewService.getByProduct(pid);
      setReviews((res.data.reviews || []).map(mapReviewToDisplay));
    } catch {
      // non-fatal
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productService.detail(productId);
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product?._id) fetchReviews(product._id);
  }, [product?._id]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-32 text-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-[-0.05em] text-[#2f2f2e]">
          Sản phẩm không tìm thấy
        </h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[#5c5b5b]">
          URL không hợp lệ hoặc sản phẩm đã bị xóa khỏi kho ({productId})
        </p>
      </section>
    );
  }

  const rawSizes = product.variants?.map((v) => v.size).filter(Boolean) || [];
  const sizes = rawSizes.length > 0 ? [...new Set(rawSizes)] : ["M"];

  const rawColors = product.variants?.map((v) => v.color).filter(Boolean) || [];
  const uniqueColorNames = [...new Set(rawColors)];

  const colors =
    uniqueColorNames.length > 0
      ? uniqueColorNames.map((c) => {
          const stored = product.variants.find((v) => v.color === c)?.colorHex;
          const storedValid = stored && stored !== "" && stored !== "#000000";
          return {
            name: c,
            hex: resolveColorHex(c) || (storedValid ? stored : null) || "#64748b",
          };
        })
      : [{ name: "Default", hex: "#0f172a" }];

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div {...scrollSlideLeft}>
            <ProductGallery
              images={
                product.images?.length > 0
                  ? product.images.map(getImageUrl)
                  : [
                      "https://placehold.co/600x600/e4e2e1/2f2f2e?text=No+Image",
                    ]
              }
              badge={product.isFeatured ? "HOT" : null}
              productName={product.name}
            />
          </motion.div>
          <motion.div {...scrollSlideRight}>
            <ProductDetails
              productId={product._id}
              productSlug={product.slug}
              productImages={product.images}
              title={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice || 0}
              description={product.description}
              colors={colors}
              sizes={sizes}
              defaultSize={sizes[0]}
              variants={product.variants || []}
            />
          </motion.div>
        </div>

        <motion.div {...scrollFadeUp}>
          <ProductInfo
            material={product.material}
            careInstructions={product.careInstructions}
            sizeChart={product.sizeChart}
          />
        </motion.div>

        <motion.div {...scrollFadeUp}>
          <VibeCheckReviews
            reviews={reviews}
            productId={product._id}
            isAuthenticated={isAuthenticated}
            onReviewSubmitted={() => fetchReviews(product._id)}
          />
        </motion.div>
      </div>
    </section>
  );
}
