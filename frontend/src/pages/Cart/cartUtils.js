// Định dạng giá tiền theo USD
export const formatUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value || 0);

// Map dữ liệu item từ store sang format hiển thị
export function mapStoreItem(item) {
  return {
    productId: item.productId,
    title: (item.name || item.title || "UNTITLED ITEM").toUpperCase(),
    price: Number(item.price) || 0,
    size: item.size || "M",
    color: item.color || "URBAN CORE",
    quantity: Number(item.quantity) || 1,
    accent: "border-[#004be3]",
    image:
      item.image ||
      item.thumbnail ||
      item.images?.[0] ||
      "http://localhost:3845/assets/ea3aa3797abbf8f764b315da26baf1825f742a15.png",
  };
}
