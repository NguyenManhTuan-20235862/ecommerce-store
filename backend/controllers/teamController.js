import * as teamService from "../services/teamService.js";

const handleError = (res, err) => {
  if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getMembers = async (_req, res) => {
  try {
    const data = await teamService.getMembers();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllMembers = async (_req, res) => {
  try {
    const data = await teamService.getAllMembers();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, role, photoUrl, photoId, order, isActive } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Tên thành viên là bắt buộc" });
    const data = await teamService.createMember({ name: name.trim(), role, photoUrl, photoId, order, isActive });
    res.status(201).json({ message: "Tạo thành viên thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateMember = async (req, res) => {
  try {
    const data = await teamService.updateMember(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Không tìm thấy thành viên" });
    res.json({ message: "Cập nhật thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteMember = async (req, res) => {
  try {
    const data = await teamService.deleteMember(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy thành viên" });
    res.json({ message: "Đã xóa thành viên", data: null });
  } catch (err) {
    handleError(res, err);
  }
};
