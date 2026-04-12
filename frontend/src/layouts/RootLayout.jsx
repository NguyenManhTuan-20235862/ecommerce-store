import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function RootLayout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative font-sans selection:bg-black selection:text-white">
      <Header />
      
      {/* 
        Outlet là nơi React Router sẽ render Component con (Home, Login, Shop...).
        Để component tự do thiết lập margin top hoặc dính vào trần màn hình (cho header trong suốt), 
        chúng ta không gò ép mt-20 ở đây.
      */}
      <main className="flex-grow flex flex-col w-full relative h-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
