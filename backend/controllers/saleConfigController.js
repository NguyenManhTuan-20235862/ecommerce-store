import * as saleConfigService from "../services/saleConfigService.js";

const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getTiers = async (_req, res) => {
  try {
    const data = await saleConfigService.getTiers();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateTiers = async (req, res) => {
  try {
    const { tiers } = req.body;
    if (!Array.isArray(tiers)) {
      return res.status(400).json({ message: "tiers phải là mảng" });
    }
    for (const t of tiers) {
      if (!t.label?.trim()) return res.status(400).json({ message: "Mỗi bậc phải có nhãn" });
      if (t.threshold === undefined || t.threshold < 0)
        return res.status(400).json({ message: "Ngưỡng chi tiêu không hợp lệ" });
      if (t.discountPercent === undefined || t.discountPercent < 0 || t.discountPercent > 100)
        return res.status(400).json({ message: "Phần trăm giảm phải trong khoảng 0-100" });
    }
    const data = await saleConfigService.updateTiers(tiers);
    res.json({ message: "Cập nhật bậc thang thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};
