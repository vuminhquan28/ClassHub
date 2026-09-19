'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, Lock, Eye, EyeOff, ArrowRight, Mail, Phone, ChevronDown } from 'lucide-react';
import { authAPI } from '@/services/api';
import { UserRole } from '@/types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onLoginSuccess?: (userData: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  initialMode = 'login', 
  onLoginSuccess 
}) => {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(initialMode === 'register');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);

  const toggleMode = (mode: 'login' | 'register') => {
    setIsRegisterMode(mode === 'register');
    setErrorMsg('');
    setSuccessMsg('');
    if (mode === 'register') {
      router.push('/register');
    } else {
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegisterMode) {
      if (!name || !email || !password) {
        return setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      }
      if (password !== confirmPassword) {
        return setErrorMsg('Mật khẩu xác nhận không trùng khớp');
      }
    } else {
      if (!email || !password) {
        return setErrorMsg('Vui lòng nhập Email và mật khẩu');
      }
    }

    try {
      if (isRegisterMode) {
        const res = await authAPI.register({ name, email, password, role });
        if (res.user) {
          localStorage.setItem('classhub_token', res.token);
          setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess(res.user);
            } else {
              router.push('/');
            }
          }, 1000);
        }
      } else {
        const res = await authAPI.login({ email, password });
        if (res.user) {
          localStorage.setItem('classhub_token', res.token);
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          } else {
            router.push('/');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white font-sans">
      
      {/* LEFT PANEL - HERO BANNER WITH GRADIENT & BACKDROP IMAGE */}
      <div 
        className="w-full lg:w-[58%] xl:w-[60%] h-64 lg:h-full relative bg-cover bg-center flex flex-col items-center justify-center p-8 lg:p-16 text-white text-center select-none overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(0, 150, 136, 0.85) 0%, rgba(13, 148, 136, 0.90) 50%, rgba(15, 118, 110, 0.95) 100%), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex flex-col items-center justify-center max-w-xl text-center z-10">
          {/* Logo with rounded glass background */}
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <GraduationCap className="w-9 h-9 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
              Class<span className="text-teal-200">Hub</span>
            </h1>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-3 drop-shadow-sm">
            University Student Portal
          </h2>
          <p className="text-sm md:text-base text-teal-100 font-medium leading-relaxed max-w-md drop-shadow-sm">
            Kết nối tri thức – Đồng hành cùng bạn trên hành trình đại học
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - FORM CONTAINER */}
      <div className="w-full lg:w-[42%] xl:w-[40%] h-full min-h-screen bg-white text-gray-800 flex flex-col justify-between items-center px-6 py-8 md:px-10 lg:px-12 z-10 overflow-y-auto">
        
        {/* TOP SECTION: ICON & HEADER */}
        <div className="w-full flex flex-col items-center mt-2 mb-4 text-center">
          <div className="p-3 rounded-2xl bg-teal-50 mb-3 border border-teal-100">
            <GraduationCap className="w-12 h-12 text-[#009688] stroke-[1.75]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#009688] tracking-tight">
            {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập tài khoản'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {isRegisterMode 
              ? 'Tạo tài khoản để bắt đầu sử dụng ClassHub' 
              : 'Vui lòng đăng nhập để bắt đầu sử dụng ClassHub'}
          </p>
        </div>

        {/* MIDDLE SECTION: AUTH FORM */}
        <div className="w-full max-w-sm flex flex-col items-center my-auto space-y-4">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="w-full p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-semibold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs text-center font-semibold">
              {successMsg}
            </div>
          )}

          {/* FORM FIELDS */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            
            {/* ROLE SELECTOR (Register Mode) */}
            {isRegisterMode && (
              <div className="relative w-full">
                <div className="absolute top-2 left-11 text-[11px] font-semibold text-gray-400 pointer-events-none">
                  Chức vụ
                </div>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full pl-11 pr-10 pt-5 pb-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="STUDENT">Sinh viên / Học sinh</option>
                  <option value="TEACHER">Giáo viên / Giảng viên</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* FULL NAME INPUT (Register Mode) */}
            {isRegisterMode && (
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  placeholder="Họ và tên đầy đủ"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm"
                  required
                />
              </div>
            )}

            {/* EMAIL INPUT */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm"
                required
              />
            </div>

            {/* PHONE INPUT (Register Mode) */}
            {isRegisterMode && (
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input 
                  type="tel"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm"
                />
              </div>
            )}

            {/* PASSWORD INPUT */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* CONFIRM PASSWORD INPUT (Register Mode) */}
            {isRegisterMode && (
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#009688] focus:ring-1 focus:ring-[#009688] transition-all shadow-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#009688] hover:bg-[#00796b] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99]"
            >
              <span>{isRegisterMode ? 'Đăng ký' : 'Đăng nhập'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* GOOGLE LOGIN BUTTON */}
          <button 
            type="button"
            onClick={() => alert('Tính năng Đăng nhập Google đang kết nối hệ thống OAuth 2.0')}
            className="w-full mt-1 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Đăng nhập bằng Google</span>
          </button>

          {/* DIVIDER */}
          <div className="relative flex py-2 items-center w-full my-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">Hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* TOGGLE LINK / BUTTON */}
          <div className="text-center text-xs text-gray-600 font-medium pt-1 space-y-2">
            {isRegisterMode ? (
              <div>
                Đã có tài khoản?{' '}
                <button 
                  type="button"
                  onClick={() => toggleMode('login')}
                  className="text-[#009688] hover:text-[#00796b] font-bold hover:underline transition-all ml-1"
                >
                  Đăng nhập
                </button>
              </div>
            ) : (
              <div>
                Chưa có tài khoản?{' '}
                <button 
                  type="button"
                  onClick={() => toggleMode('register')}
                  className="text-[#009688] hover:text-[#00796b] font-bold hover:underline transition-all ml-1"
                >
                  Đăng ký ngay
                </button>
              </div>
            )}

            {!isRegisterMode && (
              <div>
                <a 
                  href="#forgot-password" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vui lòng liên hệ quản trị viên ClassHub để khôi phục mật khẩu!');
                  }}
                  className="text-xs text-[#009688] underline font-medium hover:text-[#00796b]"
                >
                  Quên mật khẩu?
                </a>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SPACING */}
        <div className="py-2" />
      </div>
    </div>
  );
};
