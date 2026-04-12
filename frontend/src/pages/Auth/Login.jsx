import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';
import fashionImg from '../../assets/hero.png'; // placeholder img, adjust as needed

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Cột trái: Hình ảnh */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop"
          alt="Menswear Lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-light mb-4 font-serif">Gentlemen's Essence.</h2>
          <p className="text-lg opacity-90 max-w-md">Định hình phong cách quý ông với những thiết kế phục trang và phụ kiện tối giản, đẳng cấp.</p>
        </div>
      </div>

      {/* Cột phải: Form đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl tracking-tight text-gray-900 mb-2 uppercase font-medium">Đăng Nhập</h1>
            <p className="text-gray-500 mb-8 text-sm">Chào mừng bạn quay lại với Men's Filling Pieces.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 block">Tên Đăng Nhập</label>
              <input
                {...register('username')}
                type="text"
                className={`w-full bg-transparent border-0 border-b-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-black'
                } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 transition-colors duration-300 outline-none`}
                placeholder="Nhập username của bạn"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 block">Mật Khẩu</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full bg-transparent border-0 border-b-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-black'
                } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 transition-colors duration-300 outline-none`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-500 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-black w-4 h-4" /> Ghi nhớ 
              </label>
              <a href="#" className="text-gray-500 hover:text-black underline-offset-4 hover:underline transition-colors">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng Nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-black font-medium hover:underline underline-offset-4">
              Tạo tài khoản mới
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
