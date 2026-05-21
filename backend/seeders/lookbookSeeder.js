import mongoose from "mongoose";
import dotenv from "dotenv";
import Lookbook from "../models/Lookbook.js";

dotenv.config();

// 7 story cho URBAN CHRONICLES VOL.02 — WINTER/24
// order khớp đúng với slot trong Lookbook/index.jsx (0–6)
const STORIES = [
  {
    order: 0,
    title: "URBAN CHRONICLES",
    subtitle: "Sài Gòn, tháng 12 — ánh đèn vàng hắt lên từng viên gạch ẩm. Bộ sưu tập mùa đông của chúng tôi.",
    imageUrl: "https://picsum.photos/seed/portrait-hero/1000/1250",
    aspectRatio: "4:5",
    isActive: true,
  },
  {
    order: 1,
    title: "NIGHT RIDE",
    subtitle: "00:30 · Q.1 · Đường Nguyễn Huệ vắng người",
    imageUrl: "https://picsum.photos/seed/nightcity/1600/900",
    aspectRatio: "16:9",
    isActive: true,
  },
  {
    order: 2,
    title: "GOLDEN HOUR",
    subtitle: "17:42 · Bến Bạch Đằng · Nắng tắt",
    imageUrl: "https://picsum.photos/seed/goldenlight/800/1000",
    aspectRatio: "4:5",
    isActive: true,
  },
  {
    order: 3,
    title: "CONCRETE",
    subtitle: "Bê tông & da bò — hai thứ già đi cùng nhau.",
    imageUrl: "https://picsum.photos/seed/concrete-urban/800/1000",
    aspectRatio: "4:5",
    isActive: true,
  },
  {
    order: 4,
    title: "WORKSHOP",
    subtitle: "Xưởng Tôn Đản — nơi mọi thứ bắt đầu từ một tờ da phẳng.",
    imageUrl: "https://picsum.photos/seed/workshop-tall/900/1200",
    aspectRatio: "3:4",
    isActive: true,
  },
  {
    order: 5,
    title: "OFF-DUTY",
    subtitle: "Ngày nghỉ. Không lịch. Chỉ có cà phê và đôi giày cũ.",
    imageUrl: "https://picsum.photos/seed/offduty-wide/1600/900",
    aspectRatio: "16:9",
    isActive: true,
  },
  {
    order: 6,
    title: "RIDE OUT",
    subtitle: "Không cần biết đích đến — chỉ cần biết mình mặc gì.",
    imageUrl: "https://picsum.photos/seed/rideout-street/1600/900",
    aspectRatio: "16:9",
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
  console.log("✅ Kết nối MongoDB thành công");

  await Lookbook.deleteMany({});
  const created = await Lookbook.insertMany(STORIES);
  console.log(`✅ Đã tạo ${created.length} lookbook stories`);

  await mongoose.disconnect();
  console.log("🎉 Lookbook seeder hoàn tất!");
}

seed().catch((err) => {
  console.error("❌ Seeder lỗi:", err);
  mongoose.disconnect();
  process.exit(1);
});
