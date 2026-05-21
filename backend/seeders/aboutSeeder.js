import mongoose from "mongoose";
import dotenv from "dotenv";
import Store from "../models/Store.js";
import TeamMember from "../models/TeamMember.js";
import SiteConfig from "../models/SiteConfig.js";

dotenv.config();

// ─── Dữ liệu cửa hàng ────────────────────────────────────────────────────────

const STORES = [
  {
    name: "Vibe Urban – Hồ Chí Minh Flagship",
    cityKey: "SG",
    tag: "Flagship Store",
    address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    time: "09:00 – 22:00 mỗi ngày",
    phone: "028 3822 1234",
    rating: 4.9,
    reviews: 312,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4487!2d106.7027!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM2LjkiTiAxMDfCsDQyJzA5LjciRQ!5e0!3m2!1svi!2svn!4v1234567890",
    mapsUrl: "https://maps.google.com/?q=Nguyễn+Huệ+Quận+1+HCM",
    imgUrl: "",
    imgId: "",
    order: 1,
    isActive: true,
  },
  {
    name: "Vibe Urban – Hà Nội",
    cityKey: "HN",
    tag: "City Store",
    address: "45 Tràng Tiền, Phường Tràng Tiền, Hoàn Kiếm, Hà Nội",
    time: "09:00 – 21:30 mỗi ngày",
    phone: "024 3936 5678",
    rating: 4.8,
    reviews: 187,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0963!2d105.8542!3d21.0245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzI4LjIiTiAxMDXCsDUxJzE1LjEiRQ!5e0!3m2!1svi!2svn!4v1234567891",
    mapsUrl: "https://maps.google.com/?q=Tràng+Tiền+Hoàn+Kiếm+Hà+Nội",
    imgUrl: "",
    imgId: "",
    order: 2,
    isActive: true,
  },
  {
    name: "Vibe Urban – Đà Nẵng",
    cityKey: "ĐN",
    tag: "Beach Store",
    address: "78 Bạch Đằng, Phường Thạch Thang, Hải Châu, Đà Nẵng",
    time: "09:30 – 22:00 mỗi ngày",
    phone: "0236 3654 9012",
    rating: 4.7,
    reviews: 94,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8625!2d108.2208!3d16.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDA0JzA0LjEiTiAxMDjCsDEzJzE0LjkiRQ!5e0!3m2!1svi!2svn!4v1234567892",
    mapsUrl: "https://maps.google.com/?q=Bạch+Đằng+Hải+Châu+Đà+Nẵng",
    imgUrl: "",
    imgId: "",
    order: 3,
    isActive: true,
  },
  {
    name: "Vibe Urban – Hải Phòng",
    cityKey: "HP",
    tag: "Pop-up Store",
    address: "12 Điện Biên Phủ, Phường Minh Khai, Hồng Bàng, Hải Phòng",
    time: "10:00 – 21:00 mỗi ngày",
    phone: "0225 3747 3456",
    rating: 4.6,
    reviews: 58,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.6381!2d106.6881!3d20.8449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUwJzQxLjYiTiAxMDbCsDQxJzE3LjIiRQ!5e0!3m2!1svi!2svn!4v1234567893",
    mapsUrl: "https://maps.google.com/?q=Điện+Biên+Phủ+Hồng+Bàng+Hải+Phòng",
    imgUrl: "",
    imgId: "",
    order: 4,
    isActive: true,
  },
];

// ─── Dữ liệu thành viên team ──────────────────────────────────────────────────

const TEAM_MEMBERS = [
  {
    name: "Nguyễn Minh Khôi",
    role: "Founder & Creative Director",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    photoId: "",
    order: 1,
    isActive: true,
  },
  {
    name: "Trần Phương Linh",
    role: "Head of Design",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    photoId: "",
    order: 2,
    isActive: true,
  },
  {
    name: "Lê Hoàng Bảo",
    role: "Brand & Marketing Lead",
    photoUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    photoId: "",
    order: 3,
    isActive: true,
  },
  {
    name: "Phạm Thị Ngọc Anh",
    role: "Product Development Manager",
    photoUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    photoId: "",
    order: 4,
    isActive: true,
  },
  {
    name: "Vũ Đức Tài",
    role: "Visual Merchandising",
    photoUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    photoId: "",
    order: 5,
    isActive: true,
  },
  {
    name: "Đỗ Thanh Huyền",
    role: "Customer Experience Lead",
    photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    photoId: "",
    order: 6,
    isActive: true,
  },
  {
    name: "Bùi Quốc Việt",
    role: "Logistics & Supply Chain",
    photoUrl: "https://randomuser.me/api/portraits/men/25.jpg",
    photoId: "",
    order: 7,
    isActive: true,
  },
  {
    name: "Hoàng Thị Mai",
    role: "E-commerce & Tech",
    photoUrl: "https://randomuser.me/api/portraits/women/35.jpg",
    photoId: "",
    order: 8,
    isActive: true,
  },
];

// ─── Thông tin liên hệ (singleton) ────────────────────────────────────────────

const SITE_CONFIG = {
  hotline: "1800 9090",
  email: "hello@vibeurban.vn",
  zalo: "0901 234 567",
  press: "media@vibeurban.vn",
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
  console.log("✅ Kết nối MongoDB thành công");

  // Stores — xóa hết rồi insert mới (thay vì skip, vì đây là content seed)
  await Store.deleteMany({});
  const stores = await Store.insertMany(STORES);
  console.log(`✅ Đã tạo ${stores.length} cửa hàng`);

  // Team Members
  await TeamMember.deleteMany({});
  const members = await TeamMember.insertMany(TEAM_MEMBERS);
  console.log(`✅ Đã tạo ${members.length} thành viên team`);

  // Site Config — upsert singleton
  await SiteConfig.findOneAndUpdate({}, SITE_CONFIG, { upsert: true, new: true });
  console.log("✅ Đã cập nhật thông tin liên hệ");

  await mongoose.disconnect();
  console.log("🎉 About seeder hoàn tất!");
}

seed().catch((err) => {
  console.error("❌ Seeder lỗi:", err);
  mongoose.disconnect();
  process.exit(1);
});
