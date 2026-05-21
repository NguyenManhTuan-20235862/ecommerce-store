import * as storeService from "../services/storeService.js";

const VALID_CITY_KEYS = ["SG", "HN", "ĐN", "HP"];

const handleError = (res, err) => {
  if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getStores = async (_req, res) => {
  try {
    const data = await storeService.getStores();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllStores = async (_req, res) => {
  try {
    const data = await storeService.getAllStores();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, cityKey, tag, address, time, phone, rating, reviews, mapSrc, mapsUrl, imgUrl, imgId, order, isActive } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Tên cửa hàng là bắt buộc" });
    if (!cityKey || !VALID_CITY_KEYS.includes(cityKey)) {
      return res.status(400).json({ message: "cityKey phải là SG, HN, ĐN hoặc HP" });
    }
    const data = await storeService.createStore({ name: name.trim(), cityKey, tag, address, time, phone, rating, reviews, mapSrc, mapsUrl, imgUrl, imgId, order, isActive });
    res.status(201).json({ message: "Tạo cửa hàng thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateStore = async (req, res) => {
  try {
    const { cityKey } = req.body;
    if (cityKey && !VALID_CITY_KEYS.includes(cityKey)) {
      return res.status(400).json({ message: "cityKey phải là SG, HN, ĐN hoặc HP" });
    }
    const data = await storeService.updateStore(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    res.json({ message: "Cập nhật thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteStore = async (req, res) => {
  try {
    const data = await storeService.deleteStore(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    res.json({ message: "Đã xóa cửa hàng", data: null });
  } catch (err) {
    handleError(res, err);
  }
};
