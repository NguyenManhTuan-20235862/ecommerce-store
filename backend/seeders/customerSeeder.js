import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const CUSTOMERS = [
  {
    username: "nguyenvanminh",
    email: "nguyenvanminh@gmail.com",
    displayName: "Nguyễn Văn Minh",
    phone: "0901234567",
    addresses: [{
      province: "Hà Nội",
      district: "Cầu Giấy",
      ward: "Dịch Vọng",
      detail: "12 Nguyễn Phong Sắc",
      isDefault: true,
    }],
  },
  {
    username: "tranthanhlong",
    email: "tranthanhlong@gmail.com",
    displayName: "Trần Thanh Long",
    phone: "0912345678",
    addresses: [{
      province: "TP. Hồ Chí Minh",
      district: "Quận 3",
      ward: "Phường 10",
      detail: "45 Nguyễn Thị Minh Khai",
      isDefault: true,
    }],
  },
  {
    username: "lehoangnam",
    email: "lehoangnam@gmail.com",
    displayName: "Lê Hoàng Nam",
    phone: "0933456789",
    addresses: [{
      province: "Đà Nẵng",
      district: "Hải Châu",
      ward: "Thanh Bình",
      detail: "78 Trần Phú",
      isDefault: true,
    }],
  },
  {
    username: "phamquocdai",
    email: "phamquocdai@gmail.com",
    displayName: "Phạm Quốc Đại",
    phone: "0944567890",
    addresses: [{
      province: "Hải Phòng",
      district: "Lê Chân",
      ward: "An Dương",
      detail: "23 Tô Hiệu",
      isDefault: true,
    }],
  },
  {
    username: "votienhung",
    email: "votienhung@gmail.com",
    displayName: "Võ Tiến Hùng",
    phone: "0955678901",
    addresses: [{
      province: "Cần Thơ",
      district: "Ninh Kiều",
      ward: "Tân An",
      detail: "56 Nguyễn Trãi",
      isDefault: true,
    }],
  },
  {
    username: "buiminhtuan",
    email: "buiminhtuan@gmail.com",
    displayName: "Bùi Minh Tuấn",
    phone: "0966789012",
    addresses: [{
      province: "TP. Hồ Chí Minh",
      district: "Bình Thạnh",
      ward: "Phường 12",
      detail: "89 Đinh Tiên Hoàng",
      isDefault: true,
    }],
  },
  {
    username: "hoangductrung",
    email: "hoangductrung@gmail.com",
    displayName: "Hoàng Đức Trung",
    phone: "0977890123",
    addresses: [{
      province: "Hà Nội",
      district: "Đống Đa",
      ward: "Khâm Thiên",
      detail: "34 Thái Hà",
      isDefault: true,
    }],
  },
  {
    username: "dinhquangvinh",
    email: "dinhquangvinh@gmail.com",
    displayName: "Đinh Quang Vinh",
    phone: "0988901234",
    addresses: [{
      province: "Bình Dương",
      district: "Thủ Dầu Một",
      ward: "Hiệp Thành",
      detail: "67 Yersin",
      isDefault: true,
    }],
  },
  {
    username: "ngothanhphong",
    email: "ngothanhphong@gmail.com",
    displayName: "Ngô Thành Phong",
    phone: "0999012345",
    addresses: [{
      province: "Đồng Nai",
      district: "Biên Hòa",
      ward: "Tân Phong",
      detail: "15 Phạm Văn Thuận",
      isDefault: true,
    }],
  },
  {
    username: "lykimson",
    email: "lykimson@gmail.com",
    displayName: "Lý Kim Sơn",
    phone: "0900123456",
    addresses: [{
      province: "Khánh Hòa",
      district: "Nha Trang",
      ward: "Lộc Thọ",
      detail: "88 Trần Phú",
      isDefault: true,
    }],
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
      console.log(`✅ Tạo khách hàng: ${c.displayName} (${c.email})`);
      created++;
    }

    console.log(`\n📊 Khách hàng: ${created} tạo mới, ${skipped} bỏ qua`);
    console.log("🎉 Customer seed hoàn tất! Login: username / 123456");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
