import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên thành viên là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên không quá 100 ký tự"],
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
    photoId: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

teamMemberSchema.index({ order: 1 });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
