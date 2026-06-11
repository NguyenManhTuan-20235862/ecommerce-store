import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Combo from "../models/Combo.js";

dotenv.config();

// ── Helpers ───────────────────────────────────────────────────────────────────

let _counter = 1000;
const nextOrderNumber = () =>
  `VU${Date.now().toString().slice(-6)}${String(_counter++).padStart(3, "0")}`;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const PAYMENT_METHODS = ["COD", "VNPAY", "MOMO"];

const makeItem = (product, qty = 1, overridePrice = null) => {
  const variant = product.variants?.[Math.floor(Math.random() * (product.variants.length || 1))];
  return {
    productId: product._id,
    productName: product.name,
    productImage: product.images?.[0] ?? "",
    quantity: qty,
    price: overridePrice ?? product.price,
    selectedSize: variant?.size ?? "M",
    selectedColor: variant?.color ?? "Đen",
  };
};

const applyDiscount = (total, coupon) => {
  if (!coupon) return 0;
  if (coupon.discountType === "percent")
    return Math.round((total * coupon.discountValue) / 100);
  return Math.min(coupon.discountValue, total);
};

const buildOrder = ({ customer, items, coupon = null, status, paymentMethod, tierDiscount = 0, tierLabel = "" }) => {
  const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = totalAmount >= 1000000 ? 0 : 30000;
  const discountAmount = applyDiscount(totalAmount, coupon);
  const tierDiscountAmount = tierDiscount > 0 ? Math.round(totalAmount * tierDiscount / 100) : 0;
  const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount - tierDiscountAmount);
  const addr = customer.addresses?.[0];

  return {
    orderNumber: nextOrderNumber(),
    userId: customer._id,
    status,
    items,
    totalAmount,
    shippingFee,
    discountAmount: discountAmount + tierDiscountAmount,
    finalAmount,
    paymentMethod: paymentMethod ?? pick(PAYMENT_METHODS),
    shippingAddress: {
      receiverName: customer.displayName,
      receiverPhone: customer.phone ?? "0900000000",
      receiverEmail: customer.email,
      province: addr?.province ?? "Hà Nội",
      district: addr?.district ?? "Hoàn Kiếm",
      ward: addr?.ward ?? "Hàng Bài",
      detail: addr?.detail ?? "1 Đinh Tiên Hoàng",
    },
    couponCode: coupon?.code ?? null,
    tierDiscount,
    tierLabel,
  };
};

// Lấy product theo slug (fallback sang sản phẩm ngẫu nhiên nếu không tìm thấy)
const bySlug = (products, slug) =>
  products.find((p) => p.slug === slug) ?? products[Math.floor(Math.random() * products.length)];

// ── Main ──────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    const customers = await User.find({ role: "customer" });
    const products  = await Product.find({ isActive: true });
    const combos    = await Combo.find({ isActive: true }).populate("products.product");

    if (customers.length === 0) { console.error("❌ Chưa có khách hàng."); process.exit(1); }
    if (products.length  === 0) { console.error("❌ Chưa có sản phẩm.");   process.exit(1); }

    // Tạo coupon test nếu chưa có
    const existingCoupons = await Coupon.find({ isActive: true });
    const coupons = existingCoupons.length > 0
      ? existingCoupons
      : await Coupon.insertMany([
          { code: "WELCOME10", discountType: "percent", discountValue: 10, minOrderValue: 300000,  isActive: true, isPublic: true },
          { code: "SALE20",    discountType: "percent", discountValue: 20, minOrderValue: 500000,  isActive: true, isPublic: true },
          { code: "FREESHIP",  discountType: "fixed",   discountValue: 30000, minOrderValue: 0,    isActive: true, isPublic: true },
          { code: "VIP15",     discountType: "percent", discountValue: 15, minOrderValue: 800000,  isActive: true, isPublic: false },
        ]);

    // Xóa đơn hàng cũ
    const oldCount = await Order.countDocuments();
    if (oldCount > 0) {
      await Order.deleteMany({});
      console.log(`🗑  Đã xóa ${oldCount} đơn hàng cũ\n`);
    }

    console.log(`👥 ${customers.length} khách hàng | 📦 ${products.length} sản phẩm | 🎁 ${combos.length} combo | 🎫 ${coupons.length} coupon\n`);

    const c = (slug) => coupons.find((x) => x.code === slug);
    const p = (slug) => bySlug(products, slug);
    const u = (i)    => customers[i % customers.length];

    const orders = [];

    // ── 5 đơn PENDING ──────────────────────────────────────────────────────
    orders.push(buildOrder({ customer: u(0), status: "pending", paymentMethod: "COD",
      items: [makeItem(p("ao-thun-pulse-drive"), 2)] }));

    orders.push(buildOrder({ customer: u(1), status: "pending", paymentMethod: "VNPAY",
      items: [makeItem(p("quan-cargo-urban-core")), makeItem(p("ao-polo-urban-classic"))] }));

    orders.push(buildOrder({ customer: u(2), status: "pending", paymentMethod: "COD",
      coupon: c("WELCOME10"),
      items: [makeItem(p("hoodie-neon-signal"))] }));

    orders.push(buildOrder({ customer: u(3), status: "pending", paymentMethod: "MOMO",
      items: [makeItem(p("sneaker-low-top-monochrome")), makeItem(p("non-bucket-urban"), 2)] }));

    orders.push(buildOrder({ customer: u(4), status: "pending", paymentMethod: "COD",
      coupon: c("SALE20"),
      items: [makeItem(p("zip-hoodie-techwear-pro"))] }));

    // ── 5 đơn CONFIRMED ────────────────────────────────────────────────────
    orders.push(buildOrder({ customer: u(5), status: "confirmed", paymentMethod: "VNPAY",
      coupon: c("VIP15"),
      items: [makeItem(p("ao-so-mi-oxford-minimal")), makeItem(p("quan-jeans-slim-fit-dark"))] }));

    orders.push(buildOrder({ customer: u(6), status: "confirmed", paymentMethod: "MOMO",
      items: [makeItem(p("balo-den-techline"))] }));

    orders.push(buildOrder({ customer: u(7), status: "confirmed", paymentMethod: "COD",
      items: [makeItem(p("ao-khoac-bomber-basic")), makeItem(p("quan-kaki-straight-fit"))] }));

    orders.push(buildOrder({ customer: u(8), status: "confirmed", paymentMethod: "VNPAY",
      coupon: c("WELCOME10"),
      items: [makeItem(p("giay-chelsea-boot-da"))] }));

    orders.push(buildOrder({ customer: u(9), status: "confirmed", paymentMethod: "COD",
      items: [makeItem(p("sweater-ribknit-camel")), makeItem(p("vi-da-slim-bifold"))] }));

    // ── 5 đơn SHIPPING ─────────────────────────────────────────────────────
    orders.push(buildOrder({ customer: u(0), status: "shipping", paymentMethod: "COD",
      items: [makeItem(p("quan-jeans-baggy-wash"))] }));

    orders.push(buildOrder({ customer: u(1), status: "shipping", paymentMethod: "MOMO",
      coupon: c("FREESHIP"),
      items: [makeItem(p("hoodie-acid-wash-drop")), makeItem(p("tui-tote-canvas-urban"))] }));

    orders.push(buildOrder({ customer: u(2), status: "shipping", paymentMethod: "COD",
      items: [makeItem(p("giay-high-top-canvas")), makeItem(p("mu-dad-hat-washed"))] }));

    orders.push(buildOrder({ customer: u(3), status: "shipping", paymentMethod: "VNPAY",
      coupon: c("SALE20"),
      items: [makeItem(p("ao-polo-textured-pique"), 2)] }));

    orders.push(buildOrder({ customer: u(4), status: "shipping", paymentMethod: "MOMO",
      items: [makeItem(p("giay-loafer-da-minimal"))] }));

    // ── 4 đơn COMBO ────────────────────────────────────────────────────────
    const comboStatuses = ["delivered", "delivered", "shipping", "confirmed"];
    for (let i = 0; i < Math.min(4, combos.length); i++) {
      const combo = combos[i];
      const comboProducts = combo.products.filter((cp) => cp.product);
      if (comboProducts.length < 2) continue;
      const qty = comboProducts.length;
      const comboItems = comboProducts.map((cp) =>
        makeItem(cp.product, 1, Math.round(combo.comboPrice / qty / 1000) * 1000)
      );
      orders.push(buildOrder({
        customer: u(i),
        status: comboStatuses[i],
        paymentMethod: pick(PAYMENT_METHODS),
        items: comboItems,
      }));
    }

    // ── 8 đơn DELIVERED ────────────────────────────────────────────────────
    orders.push(buildOrder({ customer: u(5), status: "delivered", paymentMethod: "COD",
      items: [makeItem(p("ao-thun-basic-essential"), 3), makeItem(p("quan-short-denim-frayed"), 2)] }));

    orders.push(buildOrder({ customer: u(6), status: "delivered", paymentMethod: "VNPAY",
      coupon: c("VIP15"),
      items: [makeItem(p("giay-platform-chunky-low"))] }));

    orders.push(buildOrder({ customer: u(7), status: "delivered", paymentMethod: "MOMO",
      tierDiscount: 12, tierLabel: "TIER 3",
      items: [makeItem(p("hoodie-unisex-basic")), makeItem(p("quan-track-pants-retro")), makeItem(p("kinh-mat-rectangle-flat"))] }));

    orders.push(buildOrder({ customer: u(8), status: "delivered", paymentMethod: "COD",
      coupon: c("WELCOME10"),
      items: [makeItem(p("ao-so-mi-oversize-denim")), makeItem(p("quan-wide-leg-linen"))] }));

    orders.push(buildOrder({ customer: u(9), status: "delivered", paymentMethod: "VNPAY",
      items: [makeItem(p("giay-derby-classic-brown"))] }));

    orders.push(buildOrder({ customer: u(0), status: "delivered", paymentMethod: "MOMO",
      tierDiscount: 5, tierLabel: "TIER 1",
      coupon: c("FREESHIP"),
      items: [makeItem(p("sweater-crewneck-essential"), 2), makeItem(p("balo-mini-daypack"))] }));

    orders.push(buildOrder({ customer: u(1), status: "delivered", paymentMethod: "COD",
      items: [makeItem(p("giay-slip-on-suede-grey"))] }));

    orders.push(buildOrder({ customer: u(2), status: "delivered", paymentMethod: "VNPAY",
      tierDiscount: 18, tierLabel: "TIER 4",
      items: [makeItem(p("ao-thun-cropped-essential"), 2), makeItem(p("quan-jogger-essential")), makeItem(p("tui-clutch-nylon-urban"))] }));

    // ── 4 đơn CANCELLED ────────────────────────────────────────────────────
    orders.push(buildOrder({ customer: u(3), status: "cancelled", paymentMethod: "COD",
      items: [makeItem(p("ao-thun-racing-stripe"))] }));

    orders.push(buildOrder({ customer: u(4), status: "cancelled", paymentMethod: "MOMO",
      coupon: c("SALE20"),
      items: [makeItem(p("quan-cargo-ripstop-heavy")), makeItem(p("tui-messenger-nylon"))] }));

    orders.push(buildOrder({ customer: u(5), status: "cancelled", paymentMethod: "VNPAY",
      items: [makeItem(p("giay-oxford-minimal-white"))] }));

    orders.push(buildOrder({ customer: u(6), status: "cancelled", paymentMethod: "COD",
      items: [makeItem(p("dep-slide-foam-comfort"), 2)] }));

    // Lọc đơn hợp lệ
    const validOrders = orders.filter((o) => o.items.length > 0 && o.items.every((i) => i.productId));

    await Order.insertMany(validOrders);

    // Báo cáo
    const STATUSES = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    console.log(`✅ Đã tạo ${validOrders.length} đơn hàng:\n`);
    STATUSES.forEach((s) => {
      const n = validOrders.filter((o) => o.status === s).length;
      console.log(`   ${s.padEnd(12)}: ${n} đơn`);
    });
    console.log(`\n   Có mã giảm giá : ${validOrders.filter((o) => o.couponCode).length}`);
    console.log(`   Có tier discount: ${validOrders.filter((o) => o.tierDiscount > 0).length}`);
    console.log(`   Nhiều sản phẩm  : ${validOrders.filter((o) => o.items.length > 1).length}`);
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
