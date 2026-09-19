'use client';

import React from 'react';
import { LayoutDashboard, BookOpen, Calendar, ClipboardList, Users, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { id: 'classes', label: 'Lớp Học Của Tôi', icon: BookOpen },
    { id: 'assignments', label: 'Bài Tập & Nhiệm Vụ', icon: ClipboardList },
    { id: 'schedule', label: 'Thời Khóa Biểu', icon: Calendar },
    { id: 'members', label: 'Danh Sách Học Sinh', icon: Users },
    { id: 'settings', label: 'Cài Đặt', icon: Settings }
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0b0f19]/50 backdrop-blur-md flex flex-col p-5 gap-8 min-h-screen">
      <ul className="flex flex-col gap-1.5 list-none">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                isActive 
                  ? 'text-white bg-indigo-500/15 border-l-4 border-indigo-500 font-bold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-all">
          <LogOut className="w-5 h-5" />
          <span>Đăng Xuất</span>
        </div>
      </div>
    </aside>
  );
};
