import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ item }) {
  return (
    <div className="group relative flex flex-col pointer-events-auto cursor-pointer">
      {/* Ảnh khổ khổng lồ (2 cột max), crop chuẩn */}
      <div className="relative aspect-[4/5] w-full bg-gray-100 overflow-hidden">
        <Link to={`/product/${item._id}`}>
          {/* Default image */}
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          {/* Hover image (mô phỏng) - ở đây dùng chung 1 ảnh nhưng phóng to cực chậm để tạo cảm giác đổi ảnh */}
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover object-center scale-105 opacity-0 transition-all duration-[1000ms] ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        </Link>
      </div>

      {/* Typography: Tên cực nhỏ & Giá */}
      <div className="mt-4 flex flex-col items-center justify-center space-y-1">
        <Link to={`/product/${item._id}`}>
          <h3 className="text-[11px] uppercase tracking-widest text-black font-semibold">{item.name}</h3>
        </Link>
        <p className="text-xs text-gray-500">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
        </p>
      </div>
    </div>
  );
}
