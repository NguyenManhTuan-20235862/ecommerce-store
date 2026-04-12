import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-300 border-b ${
        isScrolled ? 'bg-white border-gray-200 text-black py-4' : 'bg-transparent border-transparent text-white py-6'
      }`}
    >
      <div className="w-full px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Navigation */}
        <nav className="hidden md:flex gap-10 flex-1">
          <Link to="/men" className="text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-50 transition-opacity">Clothing</Link>
          <Link to="/footwear" className="text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-50 transition-opacity">Footwear</Link>
          <Link to="/objects" className="text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-50 transition-opacity">Objects</Link>
        </nav>

        {/* Center: Logo */}
        <div className="flex-none text-center">
          <Link to="/" className="text-xl md:text-2xl font-serif tracking-[0.25em] font-medium uppercase mix-blend-difference">
            FILLING PIECES
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-6 flex-1">
          <button className="hover:opacity-50 transition-opacity" aria-label="Tìm kiếm">
            <Search strokeWidth={1.5} className="w-5 h-5" />
          </button>
          
          <Link 
            to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/profile') : '/login'} 
            className="hover:opacity-50 transition-opacity" 
          >
            <User strokeWidth={1.5} className="w-5 h-5" />
          </Link>

          <Link to="/cart" className="hover:opacity-50 transition-opacity relative">
            <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
