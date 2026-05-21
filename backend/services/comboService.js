import Combo from "../models/Combo.js";

const POPULATE = { path: "products.product", select: "name price images slug variants" };

export const getCombos = () =>
  Combo.find({ isActive: true }).sort({ order: 1 }).populate(POPULATE);

export const getAllCombos = () =>
  Combo.find().sort({ order: 1 }).populate(POPULATE);

export const createCombo = async (data) => {
  const combo = await Combo.create(data);
  return combo.populate(POPULATE);
};

export const updateCombo = async (id, data) => {
  const combo = await Combo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(POPULATE);
  return combo;
};

export const deleteCombo = (id) => Combo.findByIdAndDelete(id);
