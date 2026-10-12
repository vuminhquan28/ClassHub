'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Search, Plus, Bell, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { User } from '@/types';

interface NavbarProps {
  onOpenModal?: () => void;
  currentUser?: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal, currentUser }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('classhub_token');
      localStorage.removeItem('classhub_user');
    }
    router.push('/login');
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50">
      <div 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-3 font-extrabold text-xl tracking-tight gradient-text cursor-pointer hover:opacity-90 transition-opacity"
      >
        <GraduationCap className="w-8 h-8 text-indigo-500" />
        <span>ClassHub</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-72 md:w-80 focus-within:border-indigo-500 focus-within:shadow-[0_0_12px_rgba(99,102,241,0.2)] transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm lớp học, bài tập..." 
          className="bg-transparent border-none outline-none text-gray-100 text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {onOpenModal && (
          <button 
            onClick={onOpenModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm text-white gradient-primary shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo / Tham Gia Lớp</span>
            <span className="sm:hidden">Lớp</span>
          </button>
        )}

        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all" title="Thông báo">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 transition-all focus:outline-none"
            aria-label="Menu tài khoản"
          >
            <img 
              src={currentUser?.avatar || currentUser?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=User"} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/50"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white max-w-[120px] truncate">
                {currentUser?.name || currentUser?.fullName || 'Người dùng'}
              </span>
              <span className="text-[11px] text-gray-400">
                {currentUser?.role === 'TEACHER' ? 'Giảng viên' : currentUser?.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}
              </span>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#111827] border border-white/15 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-white/10 mb-1 flex items-center gap-3">
                <img 
                  src={currentUser?.avatar || currentUser?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=User"} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-indigo-400/40"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUser?.name || currentUser?.fullName || 'Người dùng'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {currentUser?.email || 'user@classhub.edu.vn'}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentUser?.role === 'TEACHER' ? 'Giảng viên' : currentUser?.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all text-left"
                >
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span>Hồ sơ cá nhân</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Bảng điều khiển</span>
                </button>
              </div>

              <div className="mt-1 pt-1 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
