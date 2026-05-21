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
    cartItemId:    item._id,
    productId:     item.productId?._id || item.productId,
    title:         (item.productName || item.name || "UNTITLED ITEM").toUpperCase(),
    price:         Number(item.price) || 0,
    originalPrice: item.originalPrice != null ? Number(item.originalPrice) : null,
    size:          item.selectedSize || item.size || "M",
    color:         item.selectedColor || item.color || "URBAN CORE",
    quantity:      Number(item.quantity) || 1,
    accent:        "border-[#004be3]",
    comboGroupId:  item.comboGroupId || null,
    comboName:     item.comboName    || null,
    image:
      item.productImage ||
      item.image ||
      item.thumbnail ||
      item.images?.[0] ||
      "http://localhost:3845/assets/ea3aa3797abbf8f764b315da26baf1825f742a15.png",
  };
}
