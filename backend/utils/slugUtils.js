// Tạo slug từ chuỗi văn bản, hỗ trợ tiếng Việt
export const generateSlug = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d") // đ → d
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Đảm bảo slug duy nhất bằng cách thêm hậu tố số (dùng cho bất kỳ Mongoose Model nào)
export const ensureUniqueSlug = async (Model, baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
