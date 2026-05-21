import mongoose from "mongoose";
import dotenv from "dotenv";
import SaleConfig from "../models/SaleConfig.js";

dotenv.config();

// ── Dữ liệu bậc thang ưu đãi ────────────────────────────────────────────────

const TIERS = [
  {
    label: "Thành Viên",
    threshold: 0,
    discountPercent: 0,
    perks: [
      "Miễn phí vận chuyển đơn từ 500.000₫",
      "Tích điểm 1% giá trị đơn hàng",
      "Nhận thông báo sản phẩm mới trước",
    ],
    order: 0,
  },
  {
    label: "Bạc",
    threshold: 2000000,
    discountPercent: 5,
    perks: [
      "Miễn phí vận chuyển mọi đơn hàng",
      "Giảm thêm 5% toàn bộ sản phẩm",
      "Tích điểm 1.5% giá trị đơn hàng",
      "Đổi trả trong 30 ngày không cần lý do",
    ],
    order: 1,
  },
  {
    label: "Vàng",
    threshold: 5000000,
    discountPercent: 10,
    perks: [
      "Miễn phí vận chuyển mọi đơn hàng",
      "Giảm thêm 10% toàn bộ sản phẩm",
      "Tích điểm 2% giá trị đơn hàng",
      "Đổi trả trong 60 ngày không cần lý do",
      "Quà tặng sinh nhật độc quyền",
      "Ưu tiên xử lý đơn hàng trong ngày",
    ],
    order: 2,
  },
  {
    label: "Kim Cương",
    threshold: 10000000,
    discountPercent: 15,
    perks: [
      "Miễn phí vận chuyển hỏa tốc mọi đơn",
      "Giảm thêm 15% toàn bộ sản phẩm",
      "Tích điểm 3% giá trị đơn hàng",
      "Đổi trả trong 90 ngày không cần lý do",
      "Quà tặng sinh nhật cao cấp",
      "Truy cập sản phẩm giới hạn trước 24 giờ",
      "Tư vấn phong cách cá nhân 1-1",
    ],
    order: 3,
  },
];

// ── main ─────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    const result = await SaleConfig.findOneAndUpdate(
      {},
      { tiers: TIERS },
      { new: true, upsert: true, runValidators: true },
    );

    console.log(`🏆 Đã lưu ${result.tiers.length} bậc thang ưu đãi:\n`);
    result.tiers.forEach((t) => {
      const threshold =
        t.threshold === 0
          ? "Từ 0₫"
          : `Từ ${t.threshold.toLocaleString("vi-VN")}₫`;
      console.log(
        `  ${t.order + 1}. ${t.label.padEnd(12)} | ${threshold.padEnd(22)} | Giảm ${t.discountPercent}%`,
      );
      t.perks.forEach((p) => console.log(`       • ${p}`));
      console.log();
    });

    console.log("🎉 Sale seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
