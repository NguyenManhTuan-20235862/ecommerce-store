import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import * as couponService from "./couponService.js";
import * as saleConfigService from "./saleConfigService.js";
import mongoose from "mongoose";

// Tạo đơn hàng mới
export const createOrder = async (
  userId,
  shippingAddress,
  paymentMethod,
  couponCode = null,
) => {
  // 1. Lấy giỏ hàng của user
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng đang trống");
  }

  // 2. Validate sản phẩm & build orderItems (chưa trừ stock)
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`Sản phẩm ${item.productName} không còn tồn tại hoặc đã bị ẩn.`);
    }

    const variant = product.variants.find(
      (v) => v.size === item.selectedSize && v.color === item.selectedColor,
    );

    if (!variant) {
      throw new Error(`Không tìm thấy biến thể Size ${item.selectedSize} - Màu ${item.selectedColor} cho sản phẩm ${item.productName}.`);
    }

    // Pre-check để trả error message thân thiện (non-atomic, atomic check ở bước 4)
    if (variant.stock < item.quantity) {
      throw new Error(`Sản phẩm ${item.productName} (Size: ${item.selectedSize}, Màu: ${item.selectedColor}) chỉ còn lại ${variant.stock} sản phẩm.`);
    }

    totalAmount += product.price * item.quantity;

    orderItems.push({
      productId: product._id,
      productName: product.name,
      productImage: product.images?.[0] || "",
      price: product.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    });
  }

  // 3. Tính phí vận chuyển, coupon, và tier discount
  const shippingFee = totalAmount >= 500000 ? 0 : 30000;

  let discountAmount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const result = await couponService.validateAndApplyCoupon(couponCode, totalAmount);
    discountAmount = result.discountAmount;
    appliedCoupon = result.coupon;
  }

  const activeTier = await saleConfigService.getTierForAmount(totalAmount);
  const tierDiscount = activeTier
    ? Math.round(totalAmount * activeTier.discountPercent / 100)
    : 0;
  const tierLabel = activeTier?.label ?? "";

  const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount - tierDiscount);

  // 4. Atomic stock decrement — dùng $elemMatch để tránh race condition
  // Nếu một item thất bại, rollback toàn bộ items đã trừ trước đó
  const decremented = [];
  try {
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          variants: {
            $elemMatch: {
              size: item.selectedSize,
              color: item.selectedColor,
              stock: { $gte: item.quantity },
            },
          },
        },
        { $inc: { "variants.$.stock": -item.quantity } },
      );

      if (!updated) {
        throw new Error(`Sản phẩm ${item.productName} (Size: ${item.selectedSize}, Màu: ${item.selectedColor}) không đủ tồn kho.`);
      }
      decremented.push(item);
    }
  } catch (err) {
    for (const item of decremented) {
      await Product.updateOne(
        { _id: item.productId, "variants.size": item.selectedSize, "variants.color": item.selectedColor },
        { $inc: { "variants.$.stock": item.quantity } },
      );
    }
    throw err;
  }

  // 5. Tạo orderNumber & lưu Order — nếu thất bại thì rollback stock
  try {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randomStr}`;

    const order = new Order({
      orderNumber,
      userId,
      status: "pending",
      items: orderItems,
      totalAmount,
      shippingFee,
      discountAmount,
      tierDiscount,
      tierLabel,
      finalAmount,
      paymentMethod,
      shippingAddress,
      couponCode,
    });

    await order.save();

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });
    }

    cart.items = [];
    cart.couponCode = null;
    await cart.save();

    return order;
  } catch (err) {
    // Rollback stock nếu lưu Order thất bại
    for (const item of decremented) {
      await Product.updateOne(
        { _id: item.productId, "variants.size": item.selectedSize, "variants.color": item.selectedColor },
        { $inc: { "variants.$.stock": item.quantity } },
      );
    }
    throw err;
  }
};

// Lấy danh sách đơn hàng của một user
export const getUserOrders = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

// Xem chi tiết một đơn hàng
export const getOrderById = async (orderId) => {
  const query = mongoose.Types.ObjectId.isValid(orderId) 
    ? { _id: orderId } 
    : { orderNumber: orderId };

  const order = await Order.findOne(query).populate("userId", "displayName email phone");
  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }
  return order;
};

// Lấy toàn bộ đơn hàng (dành cho admin) — có phân trang server-side
export const getAllOrders = async ({ page = 1, limit = 10, status } = {}) => {
  const filter   = status ? { status } : {};
  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("userId", "displayName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  return { orders, total, totalPages: Math.ceil(total / limitNum), page: pageNum, limit: limitNum };
};

const VALID_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping", "cancelled"],
  shipping: ["delivered"],
  delivered: [],
  cancelled: [],
};

// Cập nhật trạng thái đơn hàng (dành cho admin)
export const updateOrderStatus = async (orderId, newStatus) => {
  const query = mongoose.Types.ObjectId.isValid(orderId)
    ? { _id: orderId }
    : { orderNumber: orderId };

  const order = await Order.findOne(query);
  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Không thể chuyển trạng thái từ "${order.status}" sang "${newStatus}"`);
  }

  const oldStatus = order.status;
  order.status = newStatus;
  await order.save();

  // Nếu hủy đơn hàng, cộng lại stock
  if (newStatus === "cancelled" && oldStatus !== "cancelled") {
    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.selectedSize,
          "variants.color": item.selectedColor,
        },
        {
          $inc: { "variants.$.stock": item.quantity },
        }
      );
    }
  }

  return order;
};

// Thống kê tổng quan cho Admin Dashboard
export const getDashboardStats = async () => {
  // 1. Đơn hàng theo trạng thái
  const ordersByStatusRaw = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const ordersByStatus = Object.fromEntries(
    ordersByStatusRaw.map((r) => [r._id, r.count]),
  );
  const totalOrders = ordersByStatusRaw.reduce((sum, r) => sum + r.count, 0);

  // 2. Tổng doanh thu (chỉ tính đơn đã giao)
  const revenueResult = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, total: { $sum: "$finalAmount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // 3. Doanh thu theo tháng (6 tháng gần nhất, chỉ đơn delivered)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const revenueByMonth = await Order.aggregate([
    { $match: { status: "delivered", createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$finalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // 4. Top 5 sản phẩm bán chạy nhất (theo số lượng, không tính đơn cancelled)
  const topProducts = await Order.aggregate([
    { $match: { status: { $nin: ["cancelled"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.productName" },
        image: { $first: "$items.productImage" },
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // 5. Số sản phẩm hết hàng (active, không có variant nào còn stock)
  const outOfStockCount = await Product.countDocuments({
    isActive: true,
    variants: { $not: { $elemMatch: { stock: { $gt: 0 } } } },
  });

  // 6. Tổng giá vốn hàng đã bán (chỉ tính đơn delivered) — $lookup sang Product lấy costPrice
  const cogResult = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        totalCost: {
          $sum: {
            $multiply: [
              { $ifNull: ["$productInfo.costPrice", 0] },
              "$items.quantity",
            ],
          },
        },
      },
    },
  ]);
  const totalCost = cogResult[0]?.totalCost || 0;
  const estimatedProfit = totalRevenue - totalCost;

  return {
    totalOrders,
    ordersByStatus,
    totalRevenue,
    estimatedProfit,
    revenueByMonth,
    topProducts,
    outOfStock: outOfStockCount,
  };
};

// Doanh thu từng ngày trong 1 tháng (drill-down từ biểu đồ tháng)
export const getDailyRevenueByMonth = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const result = await Order.aggregate([
    { $match: { status: "delivered", createdAt: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$createdAt" } },
        revenue: { $sum: "$finalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const found = result.find((r) => r._id.day === day);
    return { day, revenue: found?.revenue ?? 0, orders: found?.orders ?? 0 };
  });
};

// User tự hủy đơn hàng
export const cancelOrder = async (orderId, userId) => {
  const query = mongoose.Types.ObjectId.isValid(orderId) 
    ? { _id: orderId, userId } 
    : { orderNumber: orderId, userId };

  const order = await Order.findOne(query);
  if (!order) {
    throw new Error("Đơn hàng không tồn tại hoặc bạn không có quyền");
  }

  if (order.status !== "pending") {
    throw new Error("Chỉ có thể hủy đơn hàng khi ở trạng thái chờ xử lý");
  }

  const CANCEL_WINDOW_MS = 12 * 60 * 60 * 1000;
  if (Date.now() - new Date(order.createdAt).getTime() > CANCEL_WINDOW_MS) {
    throw new Error("Đã quá 12 giờ kể từ khi đặt hàng, không thể hủy đơn");
  }

  order.status = "cancelled";
  await order.save();

  // Cộng lại stock
  for (const item of order.items) {
    await Product.updateOne(
      {
        _id: item.productId,
        "variants.size": item.selectedSize,
        "variants.color": item.selectedColor,
      },
      {
        $inc: { "variants.$.stock": item.quantity },
      }
    );
  }

  return order;
};
