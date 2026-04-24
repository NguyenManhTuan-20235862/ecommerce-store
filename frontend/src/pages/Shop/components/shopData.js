export const categoryFilters = [
  { key: "tops", label: "TOPS", icon: "shirt" },
  { key: "bottoms", label: "BOTTOMS", icon: "pants" },
  { key: "sneakers", label: "FOOTWEAR", icon: "shoe" },
  { key: "accessories", label: "ACCESSORIES", icon: "gem" },
];

export const sizeFilters = ["S", "M", "L", "XL", "XXL", "OS"];

export const maxPrice = 5000000;

export const shopProducts = [
  {
    id: "p1",
    title: "ELECTRIC PULSE HOODIE",
    category: "tops",
    categoryLabel: "CLOTHING / TOPS",
    price: 1250000,
    badge: { text: "NEW", tone: "brand" },
    image:
      "http://localhost:3845/assets/1135f17e21a8786676b4681484a22f0a8a4eacc6.png",
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p2",
    title: "TACTICAL CARGO V2",
    category: "bottoms",
    categoryLabel: "CLOTHING / PANTS",
    price: 1890000,
    badge: { text: "URBAN CORE", tone: "rust" },
    image:
      "http://localhost:3845/assets/bb5e222288bb857f7a638bceaf90ac445accbe12.png",
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p3",
    title: 'VELOCITY PRO "VIBE" EDITION',
    category: "sneakers",
    categoryLabel: "FOOTWEAR / SNEAKERS",
    price: 3450000,
    image:
      "http://localhost:3845/assets/dcdf8538677c35419c42e07e3154446d27bf9383.png",
    isFeatured: true,
    featured: {
      pill: "HOT RELEASE",
      lead: "LIMITED STOCK",
      text: "The most anticipated drop of the season is here.",
      cta: "PRE-ORDER NOW",
    },
  },
  {
    id: "p4",
    title: "NEO-MESSENGER XL",
    category: "accessories",
    categoryLabel: "ACCESSORIES / BAGS",
    price: 950000,
    badge: { text: "RESTOCKED", tone: "ink" },
    image:
      "http://localhost:3845/assets/6ebc4df1fcfbb259e2e4b4df1ed4ead4bc372083.png",
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p5",
    title: "ESSENTIAL BOXY TEE",
    category: "tops",
    categoryLabel: "CLOTHING / TOPS",
    price: 450000,
    image:
      "http://localhost:3845/assets/acaadfa205cf75b7a829888789d7c424a2e92a5b.png",
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p6",
    title: "VINTAGE BAGGY SHORTS",
    category: "bottoms",
    categoryLabel: "CLOTHING / BOTTOMS",
    price: 750000,
    badge: { text: "SALE -20%", tone: "green" },
    image:
      "http://localhost:3845/assets/d27708988b89f0324e7089d45f8dc2c97b431520.png",
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p7",
    title: "PULSE LOGO CAP",
    category: "accessories",
    categoryLabel: "ACCESSORIES / HEADWEAR",
    price: 320000,
    image:
      "http://localhost:3845/assets/d1500482156516ee2e496a5689f5563238890542.png",
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p8",
    title: "RIFT RUNNER CORE",
    category: "sneakers",
    categoryLabel: "FOOTWEAR / SNEAKERS",
    price: 2790000,
    badge: { text: "LIMITED", tone: "brand" },
    image:
      "http://localhost:3845/assets/dcdf8538677c35419c42e07e3154446d27bf9383.png",
    isFeatured: false,
    isNew: true,
  },
];
