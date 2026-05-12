import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { reviewService } from "../../services/review.service";
import { productService } from "../../services/product.service";
import { useAuthStore } from "../../store/authStore";
import { getImageUrl } from "../../utils/getImageUrl";
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
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-20 text-center">
        <p className="text-xl font-bold uppercase tracking-widest text-[#94a3b8]">
          Đang tải dữ liệu...
        </p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-32 text-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-[-0.05em] text-[#0f172a]">
          Sản phẩm không tìm thấy
        </h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[#94a3b8]">
          URL không hợp lệ hoặc sản phẩm đã bị xóa khỏi kho ({productId})
        </p>
      </section>
    );
  }

  // Parse variants từ Backend
  const rawSizes = product.variants?.map((v) => v.size).filter(Boolean) || [];
  const sizes = rawSizes.length > 0 ? [...new Set(rawSizes)] : ["M"];

  const rawColors = product.variants?.map((v) => v.color).filter(Boolean) || [];
  const uniqueColorNames = [...new Set(rawColors)];

  const fallbackHex = (name) => {
    const n = name.toLowerCase();
    if (n.includes("đen") || n.includes("black")) return "#0f172a";
    if (n.includes("trắng") || n.includes("white")) return "#f8fafc";
    if (n.includes("đỏ") || n.includes("red")) return "#dc2626";
    if (n.includes("xanh lá") || n.includes("green")) return "#16a34a";
    if (n.includes("xanh") || n.includes("blue") || n.includes("navy")) return "#1d4ed8";
    if (n.includes("vàng") || n.includes("yellow")) return "#ca8a04";
    if (n.includes("cam") || n.includes("orange")) return "#ea580c";
    if (n.includes("tím") || n.includes("purple")) return "#7c3aed";
    if (n.includes("hồng") || n.includes("pink")) return "#db2777";
    if (n.includes("nâu") || n.includes("brown")) return "#92400e";
    if (n.includes("xám") || n.includes("gray") || n.includes("grey")) return "#6b7280";
    if (n.includes("kem") || n.includes("beige") || n.includes("cream")) return "#d4b896";
    return "#64748b";
  };

  const colors = uniqueColorNames.length > 0 ? uniqueColorNames.map((c) => {
    const variantWithHex = product.variants.find((v) => v.color === c && v.colorHex);
    return { name: c, hex: variantWithHex?.colorHex || fallbackHex(c) };
  }) : [{ name: "Default", hex: "#0f172a" }];

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery
            images={product.images?.length > 0 ? product.images.map(getImageUrl) : ["https://placehold.co/600x600/e4e2e1/2f2f2e?text=No+Image"]}
            badge={product.isFeatured ? "HOT" : null}
          />
          <ProductDetails
            productId={product._id}
            productSlug={product.slug}
            productImages={product.images}
            title={product.name}
            price={product.price}
            description={product.description}
            colors={colors}
            sizes={sizes}
            defaultSize={sizes[0]}
            variants={product.variants || []}
          />
        </div>

        <ProductInfo
          material={product.material}
          careInstructions={product.careInstructions}
          sizeChart={product.sizeChart}
        />

        <VibeCheckReviews
          reviews={reviews}
          productId={product._id}
          isAuthenticated={isAuthenticated}
          onReviewSubmitted={() => fetchReviews(product._id)}
        />
      </div>
    </section>
  );
}
