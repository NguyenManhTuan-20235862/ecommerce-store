import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { productService } from "../../services/product.service";
import { getImageUrl } from "../../utils/getImageUrl";
import ProductDetails from "./ProductDetails";
import ProductGallery from "./ProductGallery";
import VibeCheckReviews from "./VibeCheckReviews";

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const stockInfo = (product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0) + " IN STOCK";

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
            title={product.name}
            price={product.price}
            stock={stockInfo}
            description={product.description}
            colors={colors}
            sizes={sizes}
            defaultSize={sizes[0]}
          />
        </div>

        <VibeCheckReviews reviews={[]} />
      </div>
    </section>
  );
}
