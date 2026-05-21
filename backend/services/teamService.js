import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TeamMember from "../models/TeamMember.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (photoId) => {
  if (!photoId) return;
  const filePath = path.join(__dirname, "../uploads", photoId);
  fs.unlink(filePath, () => {});
};

export const getMembers = () =>
  TeamMember.find({ isActive: true }).sort({ order: 1 });

export const getAllMembers = () =>
  TeamMember.find().sort({ order: 1 });

export const createMember = (data) => TeamMember.create(data);

export const updateMember = async (id, data) => {
  const member = await TeamMember.findById(id);
  if (!member) return null;

  if (member.photoId && (!data.photoId || data.photoId !== member.photoId)) {
    deleteImageFile(member.photoId);
  }

  return TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteMember = async (id) => {
  const member = await TeamMember.findByIdAndDelete(id);
  if (member?.photoId) deleteImageFile(member.photoId);
  return member;
};
