import SaleConfig from "../models/SaleConfig.js";

export const getTiers = async () => {
  const config = await SaleConfig.findOne();
  return config?.tiers ?? [];
};

export const updateTiers = async (tiers) => {
  const config = await SaleConfig.findOneAndUpdate(
    {},
    { tiers },
    { new: true, upsert: true, runValidators: true },
  );
  return config.tiers;
};

// Trả về tier áp dụng cho số tiền amount (sắp xếp threshold giảm dần)
export const getTierForAmount = async (amount) => {
  const tiers = await getTiers();
  if (!tiers.length) return null;
  const sorted = [...tiers].sort((a, b) => b.threshold - a.threshold);
  return sorted.find((t) => amount >= t.threshold && t.discountPercent > 0) ?? null;
};
