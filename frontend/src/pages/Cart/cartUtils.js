// Định dạng giá tiền theo VND
export const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value || 0);

// Map dữ liệu item từ store sang format hiển thị
export function mapStoreItem(item) {
  return {
    cartItemId: item._id,                                        // subdoc _id — dùng cho API update/remove
    productId: item.productId?._id || item.productId,            // product ID (sau populate là object)
    title: (item.productName || item.name || "UNTITLED ITEM").toUpperCase(),
    price: Number(item.price) || 0,
    size: item.selectedSize || item.size || "M",
    color: item.selectedColor || item.color || "URBAN CORE",
    quantity: Number(item.quantity) || 1,
    accent: "border-[#004be3]",
    image:
      item.productImage ||
      item.image ||
      item.thumbnail ||
      item.images?.[0] ||
      "http://localhost:3845/assets/ea3aa3797abbf8f764b315da26baf1825f742a15.png",
  };
}
