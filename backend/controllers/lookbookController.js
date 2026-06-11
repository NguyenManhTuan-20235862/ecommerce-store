import * as lookbookService from "../services/lookbookService.js";

const VALID_ASPECTS = ["16:9", "4:5", "3:4", "8:4"];

const handleError = (res, err) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

export const getStories = async (_req, res) => {
  try {
    const stories = await lookbookService.getStories();
    res.json({ message: "OK", data: stories });
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllStories = async (_req, res) => {
  try {
    const stories = await lookbookService.getAllStories();
    res.json({ message: "OK", data: stories });
  } catch (err) {
    handleError(res, err);
  }
};

export const createStory = async (req, res) => {
  try {
    const { title, subtitle, imageUrl, imageId, aspectRatio, order, products } = req.body;

    // BUG-4 fix: trim trước khi check
    if (!title?.trim()) {
      return res.status(400).json({ message: "Tiêu đề là bắt buộc" });
    }
    // BUG-3 fix: validate enum phía controller trước khi xuống DB
    if (aspectRatio && !VALID_ASPECTS.includes(aspectRatio)) {
      return res.status(400).json({ message: `Tỉ lệ ảnh phải là một trong: ${VALID_ASPECTS.join(", ")}` });
    }

    const story = await lookbookService.createStory({
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      imageUrl: imageUrl || "",
      imageId: imageId || "",
      aspectRatio: aspectRatio || "4:5",
      order: order ?? 0,
      products: Array.isArray(products) ? products : [],
    });
    res.status(201).json({ message: "Tạo story thành công", data: story });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateStory = async (req, res) => {
  try {
    // BUG-3 fix: validate enum khi update
    const { aspectRatio, title } = req.body;
    if (aspectRatio && !VALID_ASPECTS.includes(aspectRatio)) {
      return res.status(400).json({ message: `Tỉ lệ ảnh phải là một trong: ${VALID_ASPECTS.join(", ")}` });
    }
    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({ message: "Tiêu đề không được để trống" });
    }

    const payload = { ...req.body };
    if (title) payload.title = title.trim();

    const story = await lookbookService.updateStory(req.params.id, payload);
    if (!story) return res.status(404).json({ message: "Không tìm thấy story" });
    res.json({ message: "Cập nhật thành công", data: story });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await lookbookService.deleteStory(req.params.id);
    if (!story) return res.status(404).json({ message: "Không tìm thấy story" });
    res.json({ message: "Đã xóa story" });
  } catch (err) {
    handleError(res, err);
  }
};
