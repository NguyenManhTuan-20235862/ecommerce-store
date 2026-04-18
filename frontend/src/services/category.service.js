import api from "./api";

export const categoryService = {
  // Lấy tất cả danh mục
  list() {
    return api.get("/categories");
  },

  // Lấy chi tiết danh mục theo slug
  detail(slug) {
    return api.get(`/categories/${slug}`);
  },

  // ====== ADMIN ======
  // Tạo danh mục mới
  create(data) {
    return api.post("/categories", data);
  },

  // Cập nhật danh mục
  update(id, data) {
    return api.put(`/categories/${id}`, data);
  },

  // Xóa danh mục
  remove(id) {
    return api.delete(`/categories/${id}`);
  },
};
