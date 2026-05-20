import * as comboService from "../services/comboService.js";

const handleError = (res, err) => {
  if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getCombos = async (_req, res) => {
  try {
    const data = await comboService.getCombos();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllCombos = async (_req, res) => {
  try {
    const data = await comboService.getAllCombos();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createCombo = async (req, res) => {
  try {
    const { name, subtitle, products, comboPrice, isActive, order } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Tên combo là bắt buộc" });
    if (!Array.isArray(products) || products.length < 2)
      return res.status(400).json({ message: "Combo phải có ít nhất 2 sản phẩm" });
    if (products.some((p) => !p?.product))
      return res.status(400).json({ message: "Mỗi sản phẩm trong combo phải có trường product" });
    if (comboPrice === undefined || Number(comboPrice) < 0)
      return res.status(400).json({ message: "Giá combo không hợp lệ" });

    const data = await comboService.createCombo({
      name: name.trim(),
      subtitle: subtitle?.trim() || "",
      products,
      comboPrice: Number(comboPrice),
      isActive: isActive !== false,
      order: order ?? 0,
    });
    res.status(201).json({ message: "Tạo combo thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateCombo = async (req, res) => {
  try {
    const { name, products, comboPrice } = req.body;
    if (name !== undefined && !name?.trim())
      return res.status(400).json({ message: "Tên combo không được để trống" });
    if (products !== undefined && (!Array.isArray(products) || products.length < 2))
      return res.status(400).json({ message: "Combo phải có ít nhất 2 sản phẩm" });
    if (comboPrice !== undefined && Number(comboPrice) < 0)
      return res.status(400).json({ message: "Giá combo không hợp lệ" });

    const payload = { ...req.body };
    if (name) payload.name = name.trim();

    const data = await comboService.updateCombo(req.params.id, payload);
    if (!data) return res.status(404).json({ message: "Không tìm thấy combo" });
    res.json({ message: "Cập nhật thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteCombo = async (req, res) => {
  try {
    const data = await comboService.deleteCombo(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy combo" });
    res.json({ message: "Đã xóa combo" });
  } catch (err) {
    handleError(res, err);
  }
};
