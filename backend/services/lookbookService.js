import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Lookbook from "../models/Lookbook.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (imageId) => {
  if (!imageId) return;
  const filePath = path.join(__dirname, "../uploads", imageId);
  fs.unlink(filePath, () => {});
};

const PRODUCT_FIELDS = "name slug price compareAtPrice images totalStock";

export const getStories = () =>
  Lookbook.find({ isActive: true })
    .sort({ order: 1 })
    .populate("products", PRODUCT_FIELDS);

export const getAllStories = () =>
  Lookbook.find()
    .sort({ order: 1 })
    .populate("products", PRODUCT_FIELDS);

export const createStory = (data) => Lookbook.create(data);

export const updateStory = async (id, data) => {
  const story = await Lookbook.findById(id);
  if (!story) return null;

  // Xóa ảnh cũ nếu admin upload ảnh mới
  if (data.imageId && story.imageId && data.imageId !== story.imageId) {
    deleteImageFile(story.imageId);
  }

  return Lookbook.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteStory = async (id) => {
  const story = await Lookbook.findByIdAndDelete(id);
  if (story?.imageId) deleteImageFile(story.imageId);
  return story;
};
