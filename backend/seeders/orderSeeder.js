import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

dotenv.config();

// ── config ───────────────────────────────────────────────────────────────────

const DEMO_USERNAMES = [
  "nguyenvanminh92", "tranthihuong88", "lequoctuan95",
  "phamthuthaoo", "hoangducanh01", "vungoclinh99",
];

// Phân bổ số đơn theo tháng — tổng 61 đơn
const MONTH_PLAN = [
  { year: 2025, month: 12, count: 8 },
  { year: 2026, month: 1,  count: 10 },
  { year: 2026, month: 2,  count: 7  },
  { year: 2026, month: 3,  count: 12 },
  { year: 2026, month: 4,  count: 9  },
  { year: 2026, month: 5,  count: 15 },
];

const PAYMENT_METHODS = ["COD", "VNPAY", "MOMO"];
const NOW = new Date(2026, 4, 21); // 2026-05-21

// ── helpers ──────────────────────────────────────────────────────────────────

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick    = (arr)       => arr[Math.floor(Math.random() * arr.length)];

const randDateInMonth = (year, month) => {
  const lastDay = new Date(year, month, 0).getDate();
  return new Date(year, month - 1, randInt(1, lastDay), randInt(8, 21), randInt(0, 59), 0);
};

// Trạng thái thực tế dựa trên khoảng cách ngày
const getStatus = (orderDate) => {
  const days = (NOW - orderDate) / 86400000;
  const r = Math.random();
  if (days > 90) return r < 0.88 ? "delivered" : "cancelled";
  if (days > 30) {
    if (r < 0.78) return "delivered";
    if (r < 0.90) return "shipping";
    return "cancelled";
  }
  if (days > 7) {
    if (r < 0.55) return "delivered";
    if (r < 0.72) return "shipping";
    if (r < 0.84) return "confirmed";
    if (r < 0.92) return "pending";
    return "cancelled";
  }
  // 7 ngày gần nhất
  if (r < 0.30) return "confirmed";
  if (r < 0.55) return "shipping";
  if (r < 0.70) return "pending";
  if (r < 0.85) return "delivered";
  return "cancelled";
};

const calcDiscount = (coupon, total) => {
  if (!coupon || total < coupon.minOrderValue) return 0;
  return coupon.discountType === "percent"
    ? Math.round(total * coupon.discountValue / 100)
    : coupon.discountValue;
};

// ── main ─────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    // Load users
    const users = await User.find({ username: { $in: DEMO_USERNAMES } });
    if (users.length === 0) {
      console.error("❌ Không tìm thấy demo users — chạy demoSeeder.js trước");
      process.exit(1);
    }

    // Load sản phẩm active
    const products = await Product.find({ isActive: { $ne: false } });
    if (products.length === 0) {
      console.error("❌ Không có sản phẩm — chạy productSeeder.js trước");
      process.exit(1);
    }

    // Load coupon public còn hạn
    const coupons = await Coupon.find({ isPublic: true, isActive: true });

    let orderIdx = 0;
    let created = 0;
    let skipped = 0;

    for (const { year, month, count } of MONTH_PLAN) {
      console.log(`\n── ${month}/${year} (${count} đơn) ──`);

      for (let i = 0; i < count; i++) {
        orderIdx++;
        const orderNumber = `DEMO-${String(orderIdx).padStart(3, "0")}`;

        // Idempotency check
        const exists = await Order.findOne({ orderNumber });
        if (exists) {
          console.log(`  ⏭  ${orderNumber} đã tồn tại, bỏ qua`);
          skipped++;
          continue;
        }

        // Chọn user xoay vòng
        const user = users[orderIdx % users.length];
        const addr = user.addresses?.[0] ?? {
          province: "TP. Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "45 Nguyễn Huệ",
        };

        // Chọn 1–3 sản phẩm ngẫu nhiên
        const numItems = randInt(1, 3);
        const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, numItems);
        const items = [];
        let totalAmount = 0;

        for (const product of shuffled) {
          if (!product.variants?.length) continue;
          const variant = pick(product.variants);
          const qty     = randInt(1, 2);
          totalAmount  += product.price * qty;
          items.push({
            productId:     product._id,
            productName:   product.name,
            productImage:  product.images?.[0] ?? "",
            quantity:      qty,
            price:         product.price,
            selectedSize:  variant.size,
            selectedColor: variant.color,
          });
        }

        if (items.length === 0) continue;

        // Phí ship: miễn phí nếu >= 500k
        const shippingFee = totalAmount >= 500000 ? 0 : 30000;

        // 35% chance áp coupon
        let couponCode    = null;
        let discountAmount = 0;
        if (coupons.length > 0 && Math.random() < 0.35) {
          const valid = coupons.filter(c => totalAmount >= c.minOrderValue);
          if (valid.length > 0) {
            const coupon = pick(valid);
            const d      = calcDiscount(coupon, totalAmount);
            if (d > 0) { discountAmount = d; couponCode = coupon.code; }
          }
        }

        const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);
        const orderDate   = randDateInMonth(year, month);
        const status      = getStatus(orderDate);

        // insertOne trực tiếp để set createdAt quá khứ (bypass Mongoose timestamps)
        await Order.collection.insertOne({
          orderNumber,
          userId:    user._id,
          status,
          items,
          totalAmount,
          shippingFee,
          discountAmount,
          finalAmount,
          paymentMethod: pick(PAYMENT_METHODS),
          shippingAddress: {
            receiverName:  user.displayName,
            receiverPhone: user.phone,
            receiverEmail: user.email,
            province:      addr.province,
            district:      addr.district,
            ward:          addr.ward,
            detail:        addr.detail,
          },
          couponCode,
          createdAt: orderDate,
          updatedAt: orderDate,
        });

        const couponLabel = couponCode
          ? ` [${couponCode} -${discountAmount.toLocaleString()}đ]`
          : "";
        console.log(
          `  ✅ ${orderNumber} | ${user.displayName} | ${items.length} sp | ` +
          `${finalAmount.toLocaleString()}đ | ${status}${couponLabel} | ` +
          `${orderDate.toLocaleDateString("vi-VN")}`
        );
        created++;
      }
    }

    console.log(`\n📊 Orders: ${created} tạo mới, ${skipped} bỏ qua`);
    console.log("🎉 Order seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
