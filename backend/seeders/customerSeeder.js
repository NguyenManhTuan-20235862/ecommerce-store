import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const CUSTOMERS = [
  // ── Batch 2 (mới thêm) ────────────────────────────────────────────────────
  {
    username: "nguyenduclong",
    email: "nguyenduclong@gmail.com",
    displayName: "Nguyễn Đức Long",
    phone: "0901111111",
    addresses: [
      { province: "TP. Hồ Chí Minh", district: "Quận 5", ward: "Phường 7", detail: "22 Trần Hưng Đạo", isDefault: true },
      { province: "TP. Hồ Chí Minh", district: "Quận 7", ward: "Tân Phú", detail: "18 Nguyễn Thị Thập", isDefault: false },
    ],
  },
  {
    username: "tranvanphuc",
    email: "tranvanphuc@gmail.com",
    displayName: "Trần Văn Phúc",
    phone: "0912222222",
    addresses: [
      { province: "Hà Nội", district: "Cầu Giấy", ward: "Nghĩa Đô", detail: "35 Hoàng Quốc Việt", isDefault: true },
      { province: "Hà Nội", district: "Nam Từ Liêm", ward: "Mỹ Đình", detail: "7 Phạm Hùng", isDefault: false },
    ],
  },
  {
    username: "letrungkien",
    email: "letrungkien@gmail.com",
    displayName: "Lê Trung Kiên",
    phone: "0933333333",
    addresses: [
      { province: "Đà Nẵng", district: "Thanh Khê", ward: "Thanh Khê Đông", detail: "14 Điện Biên Phủ", isDefault: true },
      { province: "Đà Nẵng", district: "Liên Chiểu", ward: "Hòa Khánh Bắc", detail: "50 Nguyễn Lương Bằng", isDefault: false },
    ],
  },
  {
    username: "phamhoanganh",
    email: "phamhoanganh@gmail.com",
    displayName: "Phạm Hoàng Anh",
    phone: "0944444444",
    addresses: [
      { province: "Hải Phòng", district: "Kiến An", ward: "Văn Đẩu", detail: "29 Trường Chinh", isDefault: true },
      { province: "Hải Phòng", district: "Đồ Sơn", ward: "Vạn Hương", detail: "6 Lê Duẩn", isDefault: false },
    ],
  },
  {
    username: "vominhchau",
    email: "vominhchau@gmail.com",
    displayName: "Võ Minh Châu",
    phone: "0955555555",
    addresses: [
      { province: "Cần Thơ", district: "Cái Răng", ward: "Lê Bình", detail: "41 Nguyễn Văn Cừ", isDefault: true },
      { province: "Cần Thơ", district: "Ô Môn", ward: "Phước Thới", detail: "12 Hùng Vương", isDefault: false },
    ],
  },
  {
    username: "buivantoan",
    email: "buivantoan@gmail.com",
    displayName: "Bùi Văn Toàn",
    phone: "0966666666",
    addresses: [
      { province: "TP. Hồ Chí Minh", district: "Quận 10", ward: "Phường 12", detail: "63 Ba Tháng Hai", isDefault: true },
      { province: "TP. Hồ Chí Minh", district: "Phú Nhuận", ward: "Phường 9", detail: "27 Hoàng Văn Thụ", isDefault: false },
    ],
  },
  {
    username: "hoangvanson",
    email: "hoangvanson@gmail.com",
    displayName: "Hoàng Văn Sơn",
    phone: "0977777777",
    addresses: [
      { province: "Hà Nội", district: "Long Biên", ward: "Gia Thụy", detail: "55 Nguyễn Văn Cừ", isDefault: true },
      { province: "Hà Nội", district: "Gia Lâm", ward: "Trâu Quỳ", detail: "33 Ngô Gia Tự", isDefault: false },
    ],
  },
  {
    username: "dinhthanhdat",
    email: "dinhthanhdat@gmail.com",
    displayName: "Đinh Thành Đạt",
    phone: "0988888888",
    addresses: [
      { province: "Bình Dương", district: "Thuận An", ward: "Bình Chuẩn", detail: "19 Lê Lợi", isDefault: true },
      { province: "Bình Dương", district: "Bến Cát", ward: "Mỹ Phước", detail: "44 Đại lộ Thống Nhất", isDefault: false },
    ],
  },
  {
    username: "ngoducbao",
    email: "ngoducbao@gmail.com",
    displayName: "Ngô Đức Bảo",
    phone: "0999999999",
    addresses: [
      { province: "Đồng Nai", district: "Biên Hòa", ward: "Tân Hiệp", detail: "77 Đồng Khởi", isDefault: true },
      { province: "Đồng Nai", district: "Long Thành", ward: "Long Thành", detail: "15 Nguyễn Ái Quốc", isDefault: false },
    ],
  },
  {
    username: "lythanhquan",
    email: "lythanhquan@gmail.com",
    displayName: "Lý Thành Quân",
    phone: "0900111222",
    addresses: [
      { province: "Khánh Hòa", district: "Nha Trang", ward: "Phương Sài", detail: "9 Nguyễn Trãi", isDefault: true },
      { province: "Khánh Hòa", district: "Cam Ranh", ward: "Cam Lộc", detail: "31 Hùng Vương", isDefault: false },
    ],
  },

  // ── Batch 1 (khôi phục) ───────────────────────────────────────────────────
  {
    username: "nguyenvanminh",
    email: "nguyenvanminh@gmail.com",
    displayName: "Nguyễn Văn Minh",
    phone: "0901234567",
    addresses: [
      { province: "Hà Nội", district: "Cầu Giấy", ward: "Dịch Vọng", detail: "12 Nguyễn Phong Sắc", isDefault: true },
      { province: "Hà Nội", district: "Ba Đình", ward: "Điện Biên", detail: "5 Hoàng Diệu", isDefault: false },
    ],
  },
  {
    username: "tranthanhlong",
    email: "tranthanhlong@gmail.com",
    displayName: "Trần Thanh Long",
    phone: "0912345678",
    addresses: [
      { province: "TP. Hồ Chí Minh", district: "Quận 3", ward: "Phường 10", detail: "45 Nguyễn Thị Minh Khai", isDefault: true },
      { province: "TP. Hồ Chí Minh", district: "Quận 1", ward: "Bến Nghé", detail: "100 Lê Lợi", isDefault: false },
    ],
  },
  {
    username: "lehoangnam",
    email: "lehoangnam@gmail.com",
    displayName: "Lê Hoàng Nam",
    phone: "0933456789",
    addresses: [
      { province: "Đà Nẵng", district: "Hải Châu", ward: "Thanh Bình", detail: "78 Trần Phú", isDefault: true },
      { province: "Đà Nẵng", district: "Sơn Trà", ward: "An Hải Bắc", detail: "34 Võ Nguyên Giáp", isDefault: false },
    ],
  },
  {
    username: "phamquocdai",
    email: "phamquocdai@gmail.com",
    displayName: "Phạm Quốc Đại",
    phone: "0944567890",
    addresses: [
      { province: "Hải Phòng", district: "Lê Chân", ward: "An Dương", detail: "23 Tô Hiệu", isDefault: true },
      { province: "Hải Phòng", district: "Ngô Quyền", ward: "Lạch Tray", detail: "67 Trần Phú", isDefault: false },
    ],
  },
  {
    username: "votienhung",
    email: "votienhung@gmail.com",
    displayName: "Võ Tiến Hùng",
    phone: "0955678901",
    addresses: [
      { province: "Cần Thơ", district: "Ninh Kiều", ward: "Tân An", detail: "56 Nguyễn Trãi", isDefault: true },
      { province: "Cần Thơ", district: "Bình Thủy", ward: "Bình Thủy", detail: "12 Cách Mạng Tháng 8", isDefault: false },
    ],
  },
  {
    username: "buiminhtuan",
    email: "buiminhtuan@gmail.com",
    displayName: "Bùi Minh Tuấn",
    phone: "0966789012",
    addresses: [
      { province: "TP. Hồ Chí Minh", district: "Bình Thạnh", ward: "Phường 12", detail: "89 Đinh Tiên Hoàng", isDefault: true },
      { province: "TP. Hồ Chí Minh", district: "Tân Bình", ward: "Phường 9", detail: "45 Hoàng Văn Thụ", isDefault: false },
    ],
  },
  {
    username: "hoangductrung",
    email: "hoangductrung@gmail.com",
    displayName: "Hoàng Đức Trung",
    phone: "0977890123",
    addresses: [
      { province: "Hà Nội", district: "Đống Đa", ward: "Khâm Thiên", detail: "34 Thái Hà", isDefault: true },
      { province: "Hà Nội", district: "Hai Bà Trưng", ward: "Bạch Mai", detail: "78 Bạch Mai", isDefault: false },
    ],
  },
  {
    username: "dinhquangvinh",
    email: "dinhquangvinh@gmail.com",
    displayName: "Đinh Quang Vinh",
    phone: "0988901234",
    addresses: [
      { province: "Bình Dương", district: "Thủ Dầu Một", ward: "Hiệp Thành", detail: "67 Yersin", isDefault: true },
      { province: "Bình Dương", district: "Dĩ An", ward: "Bình An", detail: "15 Tô Ký", isDefault: false },
    ],
  },
  {
    username: "ngothanhphong",
    email: "ngothanhphong@gmail.com",
    displayName: "Ngô Thành Phong",
    phone: "0999012345",
    addresses: [
      { province: "Đồng Nai", district: "Biên Hòa", ward: "Tân Phong", detail: "15 Phạm Văn Thuận", isDefault: true },
      { province: "Đồng Nai", district: "Long Khánh", ward: "Phú Bình", detail: "33 Nguyễn Huệ", isDefault: false },
    ],
  },
  {
    username: "lykimson",
    email: "lykimson@gmail.com",
    displayName: "Lý Kim Sơn",
    phone: "0900123456",
    addresses: [
      { province: "Khánh Hòa", district: "Nha Trang", ward: "Lộc Thọ", detail: "88 Trần Phú", isDefault: true },
      { province: "Khánh Hòa", district: "Nha Trang", ward: "Vĩnh Hải", detail: "22 Nguyễn Thiện Thuật", isDefault: false },
    ],
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    const hashedPassword = await bcrypt.hash("123456", 10);
    let created = 0;
    let skipped = 0;

    for (const c of CUSTOMERS) {
      const exists = await User.findOne({ username: c.username });
      if (exists) {
        console.log(`⏭  "${c.username}" đã tồn tại, bỏ qua`);
        skipped++;
        continue;
      }
      await User.create({ ...c, hashedPassword, role: "customer" });
      console.log(`✅ ${c.displayName} — ${c.email}`);
      created++;
    }

    console.log(`\n📊 ${created} tạo mới, ${skipped} bỏ qua`);
    console.log("🔑 Đăng nhập: <username> / 123456");
    console.log("🎉 Customer seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
