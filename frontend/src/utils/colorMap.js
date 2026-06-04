export const COLOR_MAP = {
  // Đen
  "đen": "#1a1a1a", "đen than": "#1c1917", "đen wash": "#2d2d2d",
  "đen tech": "#111827", "đen/nâu": "#5c3a1e",
  // Trắng
  "trắng": "#f5f5f5", "trắng sữa": "#faf7f2", "trắng xám": "#e8e8e8",
  // Xám
  "xám": "#6b7280", "xám nhạt": "#d1d5db", "xám đậm": "#374151",
  "xám khói": "#4b5563", "xám wash": "#8a9ba8",
  // Đỏ
  "đỏ": "#ef4444", "đỏ đậm": "#991b1b",
  // Hồng
  "hồng": "#ec4899", "hồng nhạt": "#fbcfe8",
  // Cam
  "cam": "#f97316",
  // Vàng
  "vàng": "#eab308",
  // Xanh lam / Navy
  "xanh": "#3b82f6", "xanh lam": "#2563eb", "xanh nhạt": "#93c5fd",
  "xanh navy": "#1e3a5f", "xanh đậm": "#1e40af", "xanh đen": "#1e2d3d",
  "xanh slate": "#475569", "xanh wash": "#4a6fa5", "xanh trung": "#3a6496",
  "navy": "#0f172a",
  // Xanh lá
  "xanh lá": "#22c55e", "xanh rêu": "#4d7c0f",
  // Tím
  "tím": "#a855f7", "tím nhạt": "#d8b4fe",
  // Nâu
  "nâu": "#92400e", "nâu đất": "#78350f",
  "nâu cognac": "#8b4513", "nâu mocha": "#6b4423",
  // Be / Kem
  "be": "#d4b896", "be cát": "#c4a882", "kem": "#fef9ee",
  // Khác
  "urban core": "#2f2f2e", "trắng/đen": "#a0a0a0",
};

/**
 * Tra cứu mã hex từ tên màu tiếng Việt.
 * Trả về null nếu không tìm thấy.
 */
export const guessHex = (name) =>
  COLOR_MAP[name?.trim().toLowerCase()] ?? null;

/**
 * Fallback khi không có trong COLOR_MAP: khớp từ khoá đơn giản.
 */
export const fallbackHex = (name) => {
  const n = (name ?? "").toLowerCase();
  if (n.includes("đen") || n.includes("black"))  return "#1a1a1a";
  if (n.includes("trắng") || n.includes("white")) return "#f5f5f5";
  if (n.includes("đỏ") || n.includes("red"))     return "#dc2626";
  if (n.includes("xanh lá") || n.includes("green")) return "#16a34a";
  if (n.includes("xanh") || n.includes("blue") || n.includes("navy")) return "#1d4ed8";
  if (n.includes("vàng") || n.includes("yellow")) return "#ca8a04";
  if (n.includes("cam") || n.includes("orange"))  return "#ea580c";
  if (n.includes("tím") || n.includes("purple"))  return "#7c3aed";
  if (n.includes("hồng") || n.includes("pink"))   return "#db2777";
  if (n.includes("nâu") || n.includes("brown"))   return "#92400e";
  if (n.includes("xám") || n.includes("gray") || n.includes("grey")) return "#6b7280";
  if (n.includes("kem") || n.includes("beige") || n.includes("cream")) return "#d4b896";
  return "#64748b";
};

/** Tra hex từ tên — ưu tiên COLOR_MAP, rồi fallback pattern matching. */
export const resolveColorHex = (name) => guessHex(name) ?? fallbackHex(name);
