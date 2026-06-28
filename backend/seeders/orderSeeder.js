import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

// ── Coupon map (đồng bộ với DB) ───────────────────────────────────────────────
const COUPON_MAP = {
  WELCOME10:    { type: "percent", value: 10,     minOrder: 0        },
  FREESHIP:     { type: "fixed",   value: 30000,  minOrder: 200000   },
  URBAN20:      { type: "percent", value: 20,     minOrder: 500000   },
  SUMMER15:     { type: "percent", value: 15,     minOrder: 400000   },
  VIPONLY100:   { type: "fixed",   value: 100000, minOrder: 800000   },
  FLASH30:      { type: "percent", value: 30,     minOrder: 1000000  },
  NEWDROP:      { type: "fixed",   value: 75000,  minOrder: 0        },
  BACK2SCHOOL:  { type: "percent", value: 12,     minOrder: 350000   },
  BIGBUY25:     { type: "percent", value: 25,     minOrder: 1500000  },
  ENDSEASON:    { type: "fixed",   value: 200000, minOrder: 1200000  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

let _seq = 1000;
const nextOrderNumber = () =>
  `VU${Date.now().toString().slice(-6)}${String(_seq++).padStart(3, "0")}`;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const PAYMENT_METHODS = ["COD", "VNPAY", "MOMO"];

const randDate = (month, dayMin = 1, dayMax = 25) => {
  const day  = dayMin + Math.floor(Math.random() * (dayMax - dayMin + 1));
  const hour = Math.floor(Math.random() * 22) + 1;
  const min  = Math.floor(Math.random() * 60);
  return new Date(2026, month - 1, day, hour, min, 0);
};

const pickProducts = (products, count = 1) => {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const makeItem = (product, qty = 1) => {
  const variant = product.variants?.[Math.floor(Math.random() * Math.max(product.variants.length, 1))];
  return {
    productId:     product._id,
    productName:   product.name,
    productImage:  product.images?.[0] ?? "",
    quantity:      qty,
    price:         product.price,
    selectedSize:  variant?.size  ?? "M",
    selectedColor: variant?.color ?? "Đen",
  };
};

const buildOrder = ({ customer, items, status, paymentMethod, couponCode = null, createdAt }) => {
  const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = totalAmount >= 500000 ? 0 : 30000;

  // Tính discount từ coupon — chỉ áp dụng nếu đủ điều kiện minOrder
  let discountAmount = 0;
  let appliedCoupon  = null;
  if (couponCode && COUPON_MAP[couponCode]) {
    const c = COUPON_MAP[couponCode];
    if (totalAmount >= c.minOrder) {
      appliedCoupon  = couponCode;
      discountAmount = c.type === "percent"
        ? Math.floor(totalAmount * c.value / 100)
        : Math.min(c.value, totalAmount);
    }
  }

  const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);
  const addr        = customer.addresses?.[0];

  return {
    orderNumber: nextOrderNumber(),
    userId:      customer._id,
    status,
    items,
    totalAmount,
    shippingFee,
    discountAmount,
    finalAmount,
    paymentMethod: paymentMethod ?? pick(PAYMENT_METHODS),
    shippingAddress: {
      receiverName:  customer.displayName,
      receiverPhone: customer.phone ?? "0900000000",
      receiverEmail: customer.email,
      province:      addr?.province ?? "Hà Nội",
      district:      addr?.district ?? "Hoàn Kiếm",
      ward:          addr?.ward     ?? "Hàng Bài",
      detail:        addr?.detail   ?? "1 Đinh Tiên Hoàng",
    },
    couponCode:   appliedCoupon,
    tierDiscount: 0,
    tierLabel:    "",
    createdAt,
    updatedAt: createdAt,
  };
};

// ── Kế hoạch 5 đơn × 10 khách = 50 đơn ──────────────────────────────────────
//
// Mỗi phần tử: [status, tháng, dayMin, dayMax, couponCode?]
// Delivered: 2/khách — trải đều T1–T5 (4 đơn/tháng)
// Một số đơn có coupon — chỉ áp dụng khi totalAmount đủ điều kiện
//
const ORDER_PLAN = [
  // c0 - Nguyễn Đức Long
  [
    ["delivered", 1, 5, 25,  "WELCOME10"],
    ["delivered", 3, 8, 28,  "SUMMER15"],
    ["shipping",  6, 3, 8],
    ["confirmed", 6, 7, 11,  "FREESHIP"],
    ["pending",   6, 12, 12],
  ],
  // c1 - Trần Văn Phúc
  [
    ["delivered", 2, 5, 25,  "NEWDROP"],
    ["delivered", 4, 8, 28,  "URBAN20"],
    ["cancelled", 3, 10, 20],
    ["shipping",  6, 4, 9],
    ["pending",   6, 12, 12],
  ],
  // c2 - Lê Trung Kiên
  [
    ["delivered", 1, 8, 28,  "FREESHIP"],
    ["delivered", 5, 5, 25,  "BACK2SCHOOL"],
    ["shipping",  5, 20, 30, "WELCOME10"],
    ["confirmed", 6, 5, 10],
    ["pending",   6, 11, 12],
  ],
  // c3 - Phạm Hoàng Anh
  [
    ["delivered", 2, 8, 28,  "WELCOME10"],
    ["delivered", 3, 5, 25,  "NEWDROP"],
    ["cancelled", 4, 10, 20],
    ["shipping",  6, 3, 8],
    ["pending",   6, 12, 12],
  ],
  // c4 - Võ Minh Châu
  [
    ["delivered", 1, 10, 28, "SUMMER15"],
    ["delivered", 4, 5, 25,  "URBAN20"],
    ["shipping",  6, 2, 8],
    ["confirmed", 6, 6, 11,  "NEWDROP"],
    ["pending",   6, 12, 12],
  ],
  // c5 - Bùi Văn Toàn
  [
    ["delivered", 2, 5, 25,  "BACK2SCHOOL"],
    ["delivered", 5, 8, 28,  "WELCOME10"],
    ["cancelled", 4, 15, 25],
    ["confirmed", 6, 4, 9,   "FREESHIP"],
    ["pending",   6, 11, 12],
  ],
  // c6 - Hoàng Văn Sơn
  [
    ["delivered", 3, 5, 25,  "NEWDROP"],
    ["delivered", 4, 8, 28,  "FREESHIP"],
    ["shipping",  5, 20, 30, "BACK2SCHOOL"],
    ["shipping",  6, 3, 8],
    ["pending",   6, 12, 12],
  ],
  // c7 - Đinh Thành Đạt
  [
    ["delivered", 2, 10, 25, "URBAN20"],
    ["delivered", 5, 10, 28, "SUMMER15"],
    ["cancelled", 5, 10, 25],
    ["confirmed", 6, 5, 10,  "WELCOME10"],
    ["pending",   6, 11, 12],
  ],
  // c8 - Ngô Đức Bảo
  [
    ["delivered", 3, 8, 28,  "WELCOME10"],
    ["delivered", 4, 5, 25,  "BACK2SCHOOL"],
    ["shipping",  6, 4, 9],
    ["confirmed", 6, 7, 11,  "NEWDROP"],
    ["pending",   6, 12, 12],
  ],
  // c9 - Lý Thành Quân
  [
    ["delivered", 1, 8, 28,  "NEWDROP"],
    ["delivered", 5, 5, 25,  "SUMMER15"],
    ["shipping",  5, 18, 30, "WELCOME10"],
    ["shipping",  6, 3, 8],
    ["pending",   6, 11, 12],
  ],

  // ── Batch 1 (khôi phục) — không coupon ───────────────────────────────────

  // c10 - Nguyễn Văn Minh
  [
    ["delivered", 1, 5, 25],
    ["delivered", 3, 8, 28],
    ["shipping",  6, 3, 8],
    ["confirmed", 6, 7, 11],
    ["pending",   6, 12, 12],
  ],
  // c11 - Trần Thanh Long
  [
    ["delivered", 2, 5, 25],
    ["delivered", 4, 8, 28],
    ["cancelled", 3, 10, 20],
    ["shipping",  6, 4, 9],
    ["pending",   6, 12, 12],
  ],
  // c12 - Lê Hoàng Nam
  [
    ["delivered", 1, 8, 28],
    ["delivered", 5, 5, 25],
    ["shipping",  5, 20, 30],
    ["confirmed", 6, 5, 10],
    ["pending",   6, 11, 12],
  ],
  // c13 - Phạm Quốc Đại
  [
    ["delivered", 2, 8, 28],
    ["delivered", 3, 5, 25],
    ["cancelled", 4, 10, 20],
    ["shipping",  6, 3, 8],
    ["pending",   6, 12, 12],
  ],
  // c14 - Võ Tiến Hùng
  [
    ["delivered", 1, 10, 28],
    ["delivered", 4, 5, 25],
    ["shipping",  6, 2, 8],
    ["confirmed", 6, 6, 11],
    ["pending",   6, 12, 12],
  ],
  // c15 - Bùi Minh Tuấn
  [
    ["delivered", 2, 5, 25],
    ["delivered", 5, 8, 28],
    ["cancelled", 4, 15, 25],
    ["confirmed", 6, 4, 9],
    ["pending",   6, 11, 12],
  ],
  // c16 - Hoàng Đức Trung
  [
    ["delivered", 3, 5, 25],
    ["delivered", 4, 8, 28],
    ["shipping",  5, 20, 30],
    ["shipping",  6, 3, 8],
    ["pending",   6, 12, 12],
  ],
  // c17 - Đinh Quang Vinh
  [
    ["delivered", 2, 10, 25],
    ["delivered", 5, 10, 28],
    ["cancelled", 5, 10, 25],
    ["confirmed", 6, 5, 10],
    ["pending",   6, 11, 12],
  ],
  // c18 - Ngô Thành Phong
  [
    ["delivered", 3, 8, 28],
    ["delivered", 4, 5, 25],
    ["shipping",  6, 4, 9],
    ["confirmed", 6, 7, 11],
    ["pending",   6, 12, 12],
  ],
  // c19 - Lý Kim Sơn
  [
    ["delivered", 1, 8, 28],
    ["delivered", 5, 5, 25],
    ["shipping",  5, 18, 30],
    ["shipping",  6, 3, 8],
    ["pending",   6, 11, 12],
  ],
];

// ── Main ──────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    const customers = await User.find({ role: "customer" }).sort({ createdAt: 1 });
    const products  = await Product.find({ isActive: true });

    if (customers.length === 0) { console.error("❌ Chưa có khách hàng. Chạy customerSeeder trước."); process.exit(1); }
    if (products.length  === 0) { console.error("❌ Chưa có sản phẩm.");   process.exit(1); }

    console.log(`👥 ${customers.length} khách hàng | 📦 ${products.length} sản phẩm\n`);

    const allOrders = [];

    for (let ci = 0; ci < Math.min(customers.length, ORDER_PLAN.length); ci++) {
      const customer = customers[ci];
      const plan     = ORDER_PLAN[ci];

      // Bỏ qua khách đã có đơn hàng
      const existingCount = await Order.countDocuments({ userId: customer._id });
      if (existingCount > 0) {
        console.log(`⏭  ${customer.displayName}: đã có ${existingCount} đơn, bỏ qua`);
        continue;
      }

      for (const [status, month, dayMin, dayMax, couponCode = null] of plan) {
        const itemCount = (status === "delivered" || status === "shipping") ? pick([2, 2, 3]) : pick([1, 1, 2]);
        const chosenProducts = pickProducts(products, itemCount);
        const qty = () => pick([1, 1, 1, 2]);
        const items = chosenProducts.map((p) => makeItem(p, qty()));

        const createdAt = randDate(month, dayMin, dayMax);
        allOrders.push(buildOrder({
          customer,
          items,
          status,
          paymentMethod: pick(PAYMENT_METHODS),
          couponCode,
          createdAt,
        }));
      }

      const couponOrders = plan.filter(([, , , , c]) => c).map(([, , , , c]) => c);
      console.log(`✅ ${customer.displayName}: 5 đơn${couponOrders.length ? ` (coupon: ${couponOrders.join(", ")})` : ""}`);
    }

    await Order.collection.insertMany(allOrders);

    // ── Báo cáo ───────────────────────────────────────────────────────────────
    const STATUSES = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    console.log(`\n📊 Đã tạo ${allOrders.length} đơn hàng:`);
    for (const s of STATUSES) {
      const n = allOrders.filter((o) => o.status === s).length;
      if (n > 0) console.log(`   ${s.padEnd(12)}: ${n} đơn`);
    }

    const withCoupon = allOrders.filter((o) => o.couponCode);
    console.log(`\n🎟  Đơn dùng coupon: ${withCoupon.length} đơn`);
    const couponStats = {};
    for (const o of withCoupon) {
      couponStats[o.couponCode] = (couponStats[o.couponCode] || 0) + 1;
    }
    for (const [code, count] of Object.entries(couponStats)) {
      console.log(`   ${code.padEnd(14)}: ${count} đơn`);
    }

    const deliveredRevenue = allOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.finalAmount, 0);
    console.log(`\n💰 Doanh thu ước tính (delivered): ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(deliveredRevenue)}`);

    console.log("\n📅 Delivered theo tháng:");
    for (let m = 1; m <= 6; m++) {
      const n = allOrders.filter((o) => o.status === "delivered" && o.createdAt.getMonth() + 1 === m).length;
      if (n > 0) console.log(`   T${m}/2026: ${n} đơn`);
    }

    console.log("\n🎉 Order seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    console.error(err.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
