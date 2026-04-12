import { Link } from 'react-router';

export default function EditorialGrid() {
  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-screen">
      {/* Cột trái */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-full relative group overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=2070&auto=format&fit=crop"
          alt="Footwear Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-white text-3xl font-bold tracking-widest uppercase mb-4 opacity-0 -translate-y-4 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            FOOTWEAR
          </h2>
          <Link 
            to="/footwear" 
            className="border-b border-white text-white text-xs font-bold uppercase tracking-[0.2em] pb-1 opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:text-gray-300 hover:border-gray-300"
          >
            DISCOVER
          </Link>
        </div>
      </div>

      {/* Cột phải */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-full relative group overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1628169137175-6f6eb80aaebe?q=80&w=1964&auto=format&fit=crop"
          alt="Apparel Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-white text-3xl font-bold tracking-widest uppercase mb-4 opacity-0 -translate-y-4 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            CLOTHING
          </h2>
          <Link 
            to="/men" 
            className="border-b border-white text-white text-xs font-bold uppercase tracking-[0.2em] pb-1 opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:text-gray-300 hover:border-gray-300"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
