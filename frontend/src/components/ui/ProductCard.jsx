import { Link } from 'react-router';

export default function ProductCard({ item }) {
  return (
    <div className="group flex flex-col pointer-events-auto cursor-pointer">
      {/* Ảnh khổ Aspect 3:4 hoặc 4:5 tuỳ ý đồ Lookbook */}
      <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] overflow-hidden mb-6">
        <Link to={`/product/${item._id}`}>
          {/* Default image */}
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
          />
          {/* Fake Hover Image - zoom effect */}
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03] opacity-0 transition-all duration-[800ms] ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        </Link>
      </div>

      {/* Typography: Đậm chất streetwear, Boxy */}
      <div className="flex flex-col space-y-1 bg-white p-2 border-2 border-transparent group-hover:border-black transition-colors">
        <Link to={`/product/${item._id}`} className="hover:text-gray-500 transition-colors">
          <h3 className="text-[13px] md:text-[14px] uppercase tracking-wide text-black font-black truncate">
            {item.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          {item.compareAtPrice > item.price && (
            <span className="price line-through text-[#94a3b8]">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.compareAtPrice)}
            </span>
          )}
          <p className="price text-red-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
