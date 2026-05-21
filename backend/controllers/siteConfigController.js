import * as siteConfigService from "../services/siteConfigService.js";

const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getConfig = async (_req, res) => {
  try {
    const data = await siteConfigService.getConfig();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { hotline, email, zalo, press } = req.body;
    const data = await siteConfigService.updateConfig({ hotline, email, zalo, press });
    res.json({ message: "Cập nhật thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};
