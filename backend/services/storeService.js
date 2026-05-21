import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Store from "../models/Store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (imgId) => {
  if (!imgId) return;
  const filePath = path.join(__dirname, "../uploads", imgId);
  fs.unlink(filePath, () => {});
};

export const getStores = () =>
  Store.find({ isActive: true }).sort({ order: 1 });

export const getAllStores = () =>
  Store.find().sort({ order: 1 });

export const createStore = (data) => Store.create(data);

export const updateStore = async (id, data) => {
  const store = await Store.findById(id);
  if (!store) return null;

  if (store.imgId && (!data.imgId || data.imgId !== store.imgId)) {
    deleteImageFile(store.imgId);
  }

  return Store.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteStore = async (id) => {
  const store = await Store.findByIdAndDelete(id);
  if (store?.imgId) deleteImageFile(store.imgId);
  return store;
};
