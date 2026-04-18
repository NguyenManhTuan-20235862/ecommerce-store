import api from "./api";

export const productService = {
  // ====== PUBLIC ======
  // Lấy danh sách sản phẩm (hỗ trợ filter, sort, pagination)
  list(params = {}) {
    return api.get("/products", { params });
  },

  // Lấy chi tiết sản phẩm theo slug
  detail(slug) {
    return api.get(`/products/${slug}`);
  },

  // Lấy sản phẩm liên quan (cùng danh mục)
  related(slug) {
    return api.get(`/products/${slug}/related`);
  },

  // ====== ADMIN ======
  // Lấy tất cả sản phẩm cho Admin (kể cả inactive)
  adminList(params = {}) {
    return api.get("/products/admin/all", { params });
  },

  // Tạo sản phẩm mới
  create(data) {
    return api.post("/products", data);
  },

  // Cập nhật sản phẩm
  update(id, data) {
    return api.put(`/products/${id}`, data);
  },

  // Xóa sản phẩm
  remove(id) {
    return api.delete(`/products/${id}`);
  },

  // Upload ảnh sản phẩm (multipart/form-data)
  uploadImages(files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
