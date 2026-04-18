import Category from "../models/Category.js";

// Hàm tạo slug từ tên (hỗ trợ tiếng Việt)
const generateSlug = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// GET /api/categories — Lấy tất cả danh mục
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /api/categories/:slug — Lấy chi tiết 1 danh mục
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    return res.status(200).json({ category });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// POST /api/categories — Tạo danh mục mới (Admin)
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    const slug = generateSlug(name);

    // Kiểm tra slug trùng
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Danh mục này đã tồn tại" });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      image: image || "",
    });

    return res.status(201).json({ message: "Tạo danh mục thành công", category });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /api/categories/:id — Cập nhật danh mục (Admin)
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    if (name && name.trim()) {
      category.name = name.trim();
      category.slug = generateSlug(name);
    }
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return res.status(200).json({ message: "Cập nhật danh mục thành công", category });
  } catch (error) {
    // Xử lý lỗi duplicate slug
    if (error.code === 11000) {
      return res.status(409).json({ message: "Slug danh mục đã tồn tại" });
    }
    console.error("Lỗi khi cập nhật danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE /api/categories/:id — Xóa danh mục (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    return res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
