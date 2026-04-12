import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập Tên'),
  lastName: z.string().min(1, 'Vui lòng nhập Họ'),
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(4, 'Username ít nhất 4 ký tự'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

export default function Register() {
  const navigate = useNavigate();
  const { register: registerApi, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerApi(data);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Cột trái: Form đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl tracking-tight text-gray-900 mb-2 uppercase font-medium">Tạo Tài Khoản</h1>
            <p className="text-gray-500 mb-8 text-sm">Gia nhập thế giới thời trang nam đẳng cấp.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-500 block">Họ</label>
                <input
                  {...register('lastName')}
                  type="text"
                  className={`w-full bg-transparent border-0 border-b-2 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-black'
                  } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none transition-colors duration-300`}
                  placeholder="Ví dụ: Nguyễn"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-500 block">Tên</label>
                <input
                  {...register('firstName')}
                  type="text"
                  className={`w-full bg-transparent border-0 border-b-2 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-black'
                  } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none transition-colors duration-300`}
                  placeholder="Văn A"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 block">Tên Đăng Nhập</label>
              <input
                {...register('username')}
                type="text"
                className={`w-full bg-transparent border-0 border-b-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-black'
                } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none transition-colors duration-300`}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 block">Email</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full bg-transparent border-0 border-b-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-black'
                } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none transition-colors duration-300`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 block">Mật Khẩu</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full bg-transparent border-0 border-b-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-black'
                } py-2 px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none transition-colors duration-300`}
                placeholder="Ít nhất 6 ký tự"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng Ký'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-black font-medium hover:underline underline-offset-4">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Cột phải: Hình ảnh */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1974&auto=format&fit=crop"
          alt="Menswear Detail"
          className="w-full h-full object-cover grayscale opacity-90"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
