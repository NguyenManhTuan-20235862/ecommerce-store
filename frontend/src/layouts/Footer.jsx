export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Cột 1 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-xl font-medium tracking-widest uppercase mb-6">MENSWEAR</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Định vị phong cách nam giới hiện đại với những thiết kế tối giản, tinh tế nhưng đầy mạnh mẽ. Chất lượng làm nên đẳng cấp thực sự.
            </p>
          </div>

          {/* Cột 2 */}
          <div>
            <h4 className="font-medium tracking-widest uppercase text-sm mb-6 text-gray-200">Công Ty</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hệ thống cửa hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thành tựu</a></li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h4 className="font-medium tracking-widest uppercase text-sm mb-6 text-gray-200">Hỗ Trợ</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Kiểm tra đơn hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hỏi đáp (FAQ)</a></li>
            </ul>
          </div>

          {/* Cột 4 - Newsletter */}
          <div className="col-span-1 md:col-span-4 lg:col-span-1">
            <h4 className="font-medium tracking-widest uppercase text-sm mb-6 text-gray-200">Đăng kí nhận tin</h4>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin sớm nhất về các bộ sưu tập giới hạn và ưu đãi độc quyền.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Địa chỉ Email" 
                className="bg-transparent border-b border-gray-600 py-2 w-full text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors rounded-none"
              />
              <button 
                type="submit" 
                className="border-b border-white py-2 px-4 text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 tracking-wider uppercase">
          <p>&copy; {new Date().getFullYear()} MENSWEAR PROJECT GR1.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
