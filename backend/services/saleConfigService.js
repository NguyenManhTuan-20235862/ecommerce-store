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
