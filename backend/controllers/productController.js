import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Hàm tạo slug từ tên (hỗ trợ tiếng Việt)
const generateSlug = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Đảm bảo slug là duy nhất bằng cách thêm hậu tố nếu trùng
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Product.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ============================================
// PUBLIC ENDPOINTS
// ============================================

// GET /api/products — Danh sách sản phẩm (phân trang, lọc, sắp xếp)
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      brand,
      search,
      sort = "newest",
      featured,
    } = req.query;

    // Xây dựng filter query
    const filter = { isActive: true };

    // Lọc theo danh mục (bằng slug)
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Lọc theo biến thể (size, color)
    if (size) {
      filter["variants.size"] = size.toUpperCase();
    }
    if (color) {
      filter["variants.color"] = { $regex: new RegExp(color, "i") };
    }

    // Lọc theo thương hiệu
    if (brand) {
      filter.brand = { $regex: new RegExp(brand, "i") };
    }

    // Tìm kiếm theo tên, mô tả, SKU
    if (search) {
      filter.$text = { $search: search };
    }

    // Lọc sản phẩm nổi bật
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Xây dựng sort options
    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /api/products/:slug — Chi tiết sản phẩm
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /api/products/:slug/related — Sản phẩm liên quan (cùng danh mục)
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate("category", "name slug")
      .limit(4)
      .sort({ createdAt: -1 });

    return res.status(200).json({ products: related });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

// POST /api/products — Tạo sản phẩm mới (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      sku,
      images,
      variants,
      material,
      careInstructions,
      isFeatured,
    } = req.body;

    // Validate bắt buộc
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên sản phẩm là bắt buộc" });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: "Giá sản phẩm không hợp lệ" });
    }
    if (!category) {
      return res.status(400).json({ message: "Danh mục là bắt buộc" });
    }

    // Kiểm tra category tồn tại
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Tạo slug unique
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      price: Number(price),
      compareAtPrice: Number(compareAtPrice) || 0,
      category,
      brand: brand?.trim() || "",
      sku: sku?.trim().toUpperCase() || "",
      images: images || [],
      variants: variants || [],
      material: material?.trim() || "",
      careInstructions: careInstructions?.trim() || "",
      isFeatured: Boolean(isFeatured),
    });

    // Populate category trước khi trả về
    await product.populate("category", "name slug");

    return res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /api/products/:id — Cập nhật sản phẩm (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      sku,
      images,
      variants,
      material,
      careInstructions,
      isFeatured,
      isActive,
    } = req.body;

    // Nếu đổi tên → tạo slug mới
    if (name && name.trim() && name.trim() !== product.name) {
      product.name = name.trim();
      const baseSlug = generateSlug(name);
      product.slug = await ensureUniqueSlug(baseSlug, product._id);
    }

    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (compareAtPrice !== undefined) product.compareAtPrice = Number(compareAtPrice);
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }
      product.category = category;
    }
    if (brand !== undefined) product.brand = brand.trim();
    if (sku !== undefined) product.sku = sku.trim().toUpperCase();
    if (images !== undefined) product.images = images;
    if (variants !== undefined) product.variants = variants;
    if (material !== undefined) product.material = material.trim();
    if (careInstructions !== undefined) product.careInstructions = careInstructions.trim();
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();
    await product.populate("category", "name slug");

    return res.status(200).json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Slug sản phẩm đã tồn tại" });
    }
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE /api/products/:id — Xóa sản phẩm (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /api/products/admin/all — Lấy tất cả sản phẩm cho Admin (kể cả inactive)
export const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { sku: { $regex: new RegExp(search, "i") } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm admin:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
