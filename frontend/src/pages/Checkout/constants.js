export const manifestItems = [
  {
    title: "CYBER-PULSE HOODIE",
    variant: "SIZE: XL | QTY: 1",
    price: "1.250.000đ",
    image:
      "http://localhost:3845/assets/30ac8f97cfd3b698742224d830c96539835f4df0.png",
  },
  {
    title: "CONCRETE CARGO V2",
    variant: "SIZE: 32 | QTY: 1",
    price: "890.000đ",
    image:
      "http://localhost:3845/assets/4537eb5b9677fcc24e37f02bbb3e22a0b4867b22.png",
  },
  {
    title: "VELOCITY RUNNERS",
    variant: "SIZE: 42 | QTY: 1",
    price: "2.450.000đ",
    image:
      "http://localhost:3845/assets/fff2327b3d55bbbf736797dfa0ba450a02a6a03a.png",
  },
];

export const shippingMethods = [
  {
    value: "urban-pulse",
    title: "Urban Pulse Delivery",
    eta: "2-3 Business Days",
    fee: 30000,
  },
  {
    value: "express-velocity",
    title: "Express Velocity",
    eta: "Next Day Priority",
    fee: 50000,
  },
];

export const paymentMethods = [
  { value: "cod", label: "COD", type: "icon" },
  { value: "momo", label: "MOMO WALLET", type: "momo" },
  { value: "vnpay", label: "VNPAY QR", type: "vnpay" },
];

export const cityOptions = [
  {
    value: "hanoi",
    label: "Hà Nội",
    districts: ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy"],
  },
  {
    value: "hcm",
    label: "TP. Hồ Chí Minh",
    districts: ["Quận 1", "Quận 3", "Quận Bình Thạnh", "TP. Thủ Đức"],
  },
];

export const subtotal = 4590000;
export const tax = 462000;

export const formatVnd = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
