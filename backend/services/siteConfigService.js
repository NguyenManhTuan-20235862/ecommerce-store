import SiteConfig from "../models/SiteConfig.js";

export const getConfig = async () => {
  const config = await SiteConfig.findOne();
  return config ?? {};
};

export const updateConfig = async (data) => {
  const config = await SiteConfig.findOneAndUpdate(
    {},
    data,
    { new: true, upsert: true, runValidators: true },
  );
  return config;
};
