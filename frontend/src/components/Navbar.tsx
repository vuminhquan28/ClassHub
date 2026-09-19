'use client';

import React from 'react';
import { GraduationCap, Search, Plus, Bell } from 'lucide-react';
import { User } from '@/types';

interface NavbarProps {
  onOpenModal: () => void;
  currentUser?: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal, currentUser }) => {
  return (
    <header className="h-[72px] flex items-center justify-between px-8 border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 font-extrabold text-xl tracking-tight gradient-text">
        <GraduationCap className="w-8 h-8 text-indigo-500" />
        <span>ClassHub</span>
      </div>

      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-80 focus-within:border-indigo-500 focus-within:shadow-[0_0_12px_rgba(99,102,241,0.2)] transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm lớp học, bài tập, giáo viên..." 
          className="bg-transparent border-none outline-none text-gray-100 text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded.xl font-semibold text-sm text-white gradient-primary shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo / Tham Gia Lớp</span>
        </button>

        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all" title="Thông báo">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 ml-2">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} 
            alt="Avatar" 
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/50"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{currentUser?.name || 'Cô Nguyễn Thu Hà'}</span>
            <span className="text-[11px] text-gray-400">{currentUser?.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
