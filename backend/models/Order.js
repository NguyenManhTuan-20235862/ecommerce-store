import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải ≥ 1"],
    },
    price: {
      type: Number,
      required: true,
    },
    selectedSize: {
      type: String,
      required: true,
    },
    selectedColor: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO"],
      default: "COD",
    },
    shippingAddress: {
      receiverName: { type: String, required: true },
      receiverPhone: { type: String, required: true },
      receiverEmail: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      detail: { type: String, required: true },
    },
    couponCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
