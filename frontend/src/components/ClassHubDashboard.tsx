'use client';

import React, { useState } from 'react';
import {
  Home,
  Calendar,
  BookOpen,
  Mail,
  HelpCircle,
  Search,
  Bell,
  User as UserIcon,
  Plus,
  Megaphone,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckSquare,
  Square,
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type UserRole = 'student' | 'teacher';

interface AnnouncementItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
  roleScope: 'student' | 'teacher' | 'all';
}

interface ScheduleItem {
  id: string;
  title: string;
  code: string;
  room: string;
  time: string;
  completed: boolean;
  roleScope: 'student' | 'teacher' | 'all';
}

export function ClassHubDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new activity
  const [activityTitle, setActivityTitle] = useState('');
  const [activityType, setActivityType] = useState('announcement');
  const [activityRoom, setActivityRoom] = useState('');
  const [activityTime, setActivityTime] = useState('');

  // Initial Announcements Data
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: 'ann_1',
      title: 'Lịch nộp báo cáo bài tập lớn',
      subtitle: 'Lớp học phần: 2627I_INT3108_1,',
      time: '11:15 AM',
      unread: true,
      roleScope: 'student'
    },
    {
      id: 'ann_2',
      title: 'Lịch học ngày mai (21/9/2026)',
      subtitle: 'Phòng Đào tạo',
      time: '9:08 PM',
      unread: false,
      roleScope: 'all'
    },
    {
      id: 'ann_3',
      title: 'Nhắc nhở chấm bài tập lớn hệ thống',
      subtitle: 'Lớp: 2627I_INT3108_1',
      time: '10:00 AM',
      unread: true,
      roleScope: 'teacher'
    },
    {
      id: 'ann_4',
      title: 'Thông báo họp khoa Công nghệ thông tin',
      subtitle: 'Ban BGH',
      time: '2:30 PM',
      unread: false,
      roleScope: 'teacher'
    }
  ]);

  // Initial Schedule Data
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: 'sch_1',
      title: 'LẬP TRÌNH NHỮNG VÀ THỜI GIAN THỰC',
      code: '2627I_INT3108_1',
      room: '2627',
      time: '11:15 AM',
      completed: false,
      roleScope: 'all'
    },
    {
      id: 'sch_2',
      title: 'MÁY VÀ AN TOÀN THÔNG TIN',
      code: '2627I_INT3108_2',
      room: '2627',
      time: '9:08 PM',
      completed: false,
      roleScope: 'all'
    },
    {
      id: 'sch_3',
      title: 'THỰC HÀNH HỆ TRUYỀN THÔNG LỚP A1',
      code: '2627I_INT3108_3',
      room: 'Lab 402',
      time: '02:00 PM',
      completed: false,
      roleScope: 'teacher'
    }
  ]);

  const unreadCount = announcements.filter((a) => a.unread).length;

  const toggleScheduleComplete = (id: string) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    if (activityType === 'announcement') {
      const newAnn: AnnouncementItem = {
        id: `ann_${Date.now()}`,
        title: activityTitle,
        subtitle: activityRoom ? `Phòng: ${activityRoom}` : 'Thông báo mới',
        time: activityTime || 'Vừa xong',
        unread: true,
        roleScope: currentRole
      };
      setAnnouncements([newAnn, ...announcements]);
    } else {
      const newSch: ScheduleItem = {
        id: `sch_${Date.now()}`,
        title: activityTitle.toUpperCase(),
        code: '2627I_NEW',
        room: activityRoom || 'Phòng 101',
        time: activityTime || '10:00 AM',
        completed: false,
        roleScope: currentRole
      };
      setSchedules([newSch, ...schedules]);
    }

    setActivityTitle('');
    setActivityRoom('');
    setActivityTime('');
    setIsNewActivityModalOpen(false);
  };

  // Filtering by role and search query
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesRole = a.roleScope === 'all' || a.roleScope === currentRole;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredSchedules = schedules.filter((s) => {
    const matchesRole = s.roleScope === 'all' || s.roleScope === currentRole;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#edf6f4] text-slate-800 font-sans selection:bg-[#009e82] selection:text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-[#014e43] via-[#025a4d] to-[#013d34] text-white flex flex-col justify-between shrink-0 shadow-xl relative z-20">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/30 border border-teal-300/40 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                ClassHub
              </h1>
              <p className="text-[11px] text-emerald-200/80 font-medium tracking-wide">
                University Student Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 mt-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>{currentRole === 'teacher' ? 'Lịch giảng dạy' : 'Lịch học'}</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'courses'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Khóa học</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'messages'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Hộp thư</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'help'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Trợ giúp</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Illustration Banner */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#01695b] to-[#014238] border border-teal-400/20 overflow-hidden relative shadow-lg group">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80')"
            }}
          />
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center mb-2 text-emerald-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed font-medium">
              Kết nối tri thức – Đồng hành cùng bạn trên hành trình đại học
            </p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-teal-100/80 bg-[#edf6f4]/90 backdrop-blur-md sticky top-0 z-10">
          {/* Search Box */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-teal-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-white text-slate-700 placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-full border border-teal-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82] transition-all"
            />
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-9 h-9 rounded-full bg-white border border-teal-100 flex items-center justify-center text-teal-800 hover:bg-teal-50 shadow-sm transition-all relative"
                title="Thông báo"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-teal-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#009e82]" /> Thông báo mới ({unreadCount})
                    </h3>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                    {filteredAnnouncements.map((ann) => (
                      <div key={ann.id} className="py-2.5 text-left hover:bg-slate-50 rounded-lg p-2 transition">
                        <p className="text-xs font-semibold text-slate-800">{ann.title}</p>
                        <p className="text-[11px] text-slate-500">{ann.subtitle}</p>
                        <p className="text-[10px] text-teal-600 font-medium mt-1">{ann.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2.5 bg-white border border-teal-100 px-3.5 py-1.5 rounded-full shadow-sm hover:bg-teal-50/50 transition-all text-slate-700"
              >
                <div className="w-6 h-6 rounded-full bg-[#009e82] text-white flex items-center justify-center text-xs font-semibold">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-teal-900">
                  {currentRole === 'student' ? 'Sinh viên' : 'Giảng viên'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-teal-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Chọn vai trò hiển thị
                  </div>
                  <button
                    onClick={() => {
                      setCurrentRole('student');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                      currentRole === 'student'
                        ? 'bg-teal-50 text-[#009e82] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Sinh viên</span>
                    </div>
                    {currentRole === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-[#009e82]" />}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('teacher');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                      currentRole === 'teacher'
                        ? 'bg-teal-50 text-[#009e82] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Giảng viên</span>
                    </div>
                    {currentRole === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-[#009e82]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD PAGE CONTENT */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Main Title & Action Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Tổng quan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thứ Ba, 15 tháng 9 năm 2026
              </p>
            </div>

            <button
              onClick={() => setIsNewActivityModalOpen(true)}
              className="bg-[#009e82] hover:bg-[#02856e] text-white px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Hoạt động mới</span>
            </button>
          </div>

          {/* TWO COLUMN GRID SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1: THÔNG BÁO MỚI NHẤT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009e82] flex items-center justify-center">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Thông báo mới nhất
                    </h3>
                  </div>

                  <button className="text-xs text-[#009e82] hover:text-[#02705d] font-medium flex items-center gap-1 hover:underline transition">
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Announcement List */}
                <div className="space-y-3">
                  {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.slice(0, 4).map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-slate-50/70 hover:bg-teal-50/40 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              ann.unread ? 'bg-[#009e82]' : 'bg-slate-300'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#009e82] transition-colors">
                              {ann.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {ann.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0 ml-3">
                          {ann.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Không có thông báo nào.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: LỊCH HỌC HÔM NAY / LỊCH GIẢNG DẠY HÔM NAY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009e82] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {currentRole === 'teacher' ? 'Lịch giảng dạy hôm nay' : 'Lịch học hôm nay'}
                    </h3>
                  </div>

                  <button className="text-xs text-[#009e82] hover:text-[#02705d] font-medium flex items-center gap-1 hover:underline transition">
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Schedule Items List */}
                <div className="space-y-3">
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((item, idx) => {
                      const isHighlighted = idx === 0;
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                            isHighlighted
                              ? 'bg-teal-50/50 border-[#009e82]/40 border-l-4 border-l-[#009e82]'
                              : 'bg-slate-50/70 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleScheduleComplete(item.id)}
                              className="text-slate-400 hover:text-[#009e82] transition-colors"
                            >
                              {item.completed ? (
                                <CheckSquare className="w-4 h-4 text-[#009e82]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <div>
                              <p
                                className={`text-xs font-bold ${
                                  item.completed
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-800'
                                }`}
                              >
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                ({item.code}) - Phòng: {item.room}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-medium text-slate-500 shrink-0 ml-3">
                            {item.time}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Không có lịch nào cho hôm nay.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FULL WIDTH CARD: HÔM NAY / TIMELINE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009e82] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Hôm nay</h3>
                <p className="text-[11px] text-slate-400">
                  Thứ Ba, 15 tháng 9 năm 2026
                </p>
              </div>
            </div>

            {/* Empty state illustration box */}
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-teal-50/80 border border-teal-100/60 flex items-center justify-center mb-4 relative shadow-inner">
                <Calendar className="w-10 h-10 text-[#009e82]/80" />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#009e82] text-white flex items-center justify-center border-2 border-white shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Chưa có gì để hiển thị
              </h4>
              <p className="text-xs text-slate-400">
                Không có hoạt động nào trong ngày hôm nay.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ================= NEW ACTIVITY MODAL ================= */}
      {isNewActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-teal-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#009e82] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Tạo hoạt động mới ({currentRole === 'teacher' ? 'Giảng viên' : 'Sinh viên'})
                </h3>
              </div>
              <button
                onClick={() => setIsNewActivityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Loại hoạt động
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-[#009e82] focus:outline-none"
                >
                  <option value="announcement">Thông báo tin tức</option>
                  <option value="schedule">Lịch học / Giảng dạy mới</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề hoạt động
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lịch kiểm tra giữa kỳ..."
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-[#009e82] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học / Địa điểm
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phòng 2627"
                    value={activityRoom}
                    onChange={(e) => setActivityRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-[#009e82] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời gian
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 10:00 AM"
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-[#009e82] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewActivityModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#009e82] hover:bg-[#02856e] rounded-xl shadow-md transition"
                >
                  Lưu hoạt động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
