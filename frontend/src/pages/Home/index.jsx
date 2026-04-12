import HeroCover from './components/HeroSlider'; // still imports from the same file
import ProductCard from '../../components/ui/ProductCard';
import EditorialGrid from './components/EditorialGrid';

// Mock Data
const MOCK_NEW_ARRIVALS = [
  { _id: '1', name: 'OVERSIZED BLAZER WOOL', price: 1250000, image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1974&auto=format&fit=crop' },
  { _id: '2', name: 'TAILORED STRAIGHT TROUSERS', price: 850000, image: 'https://images.unsplash.com/photo-1620012253295-c15bc3e653f3?q=80&w=1965&auto=format&fit=crop' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* Khối Cover tĩnh */}
      <HeroCover />

      {/* Khối Hình Tạp Chí (Editorial) tràn viền không khoảng cách */}
      <EditorialGrid />

      {/* Lưới Sản Phẩm Đinh: Thay vì 4 cột bé xíu, giờ là 2 cột chà bá */}
      <section className="py-32 w-full mx-auto px-6 lg:px-12 bg-white flex flex-col items-center">
        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase mb-16 text-center text-black">
          LATEST ADDITIONS
        </h2>

        {/* Cấu trúc Grid 2 hình siêu bự */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 w-full max-w-[1400px]">
          {MOCK_NEW_ARRIVALS.map(item => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>

        <div className="mt-20">
          <button className="border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
            XEM TOÀN BỘ SẢN PHẨM
          </button>
        </div>
      </section>
    </div>
  );
}
