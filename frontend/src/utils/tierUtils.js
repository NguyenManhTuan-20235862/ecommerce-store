// Trả về tier phù hợp với số tiền subtotal (lấy tier cao nhất còn đạt ngưỡng)
export function getApplicableTier(subtotal, tiers) {
  if (!tiers?.length || subtotal <= 0) return null;
  const sorted = [...tiers].sort((a, b) => b.threshold - a.threshold);
  return sorted.find((t) => subtotal >= t.threshold && t.discountPercent > 0) ?? null;
}

// Trả về tier liền kế tiếp (chưa đạt) để gợi ý user mua thêm
export function getNextTier(subtotal, tiers) {
  if (!tiers?.length) return null;
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  return (
    sorted.find((t) => subtotal < t.threshold && t.discountPercent > 0) ?? null
  );
}

// Tính số tiền giảm từ tier (làm tròn 1.000đ)
export function computeTierDiscount(subtotal, tiers) {
  const tier = getApplicableTier(subtotal, tiers);
  if (!tier) return 0;
  return Math.round((subtotal * tier.discountPercent) / 100 / 1000) * 1000;
}
