'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  CheckCircle2,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { authAPI, dashboardAPI } from '@/services/api';

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
  room?: string;
  time?: string;
  dayOfWeek?: number;
  dayName?: string;
  timeSlot?: string;
  credits?: number;
  completed: boolean;
  roleScope: 'student' | 'teacher' | 'all';
}

export function ClassHubDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User state & Dashboard summary from DB / Auth
  const [user, setUser] = useState<{ id?: string; name?: string; email?: string; role?: string; avatar?: string } | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  // Real-time Date and Time state
  const [currentDateTimeString, setCurrentDateTimeString] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentDateTimeString(`${dayName}, ${day} tháng ${month} năm ${year} ${hours}:${minutes}:${seconds}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Read cached user first
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('classhub_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          if (parsed.role === 'TEACHER') {
            setCurrentRole('teacher');
          } else if (parsed.role === 'STUDENT') {
            setCurrentRole('student');
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch fresh Dashboard Summary from DB API
      const token = localStorage.getItem('classhub_token');
      if (token) {
        dashboardAPI.getSummary()
          .then((res) => {
            if (res.success) {
              if (res.user) {
                setUser(res.user);
                if (res.user.role === 'TEACHER') {
                  setCurrentRole('teacher');
                } else if (res.user.role === 'STUDENT') {
                  setCurrentRole('student');
                }
                localStorage.setItem('classhub_user', JSON.stringify(res.user));
              }
              if (res.totalCredits !== undefined) {
                setTotalCredits(res.totalCredits);
              }
              if (res.schedules) {
                const userRole = res.user?.role || 'STUDENT';
                const roleSchedules = userRole === 'TEACHER' ? res.schedules.teacher : res.schedules.student;
                if (roleSchedules && roleSchedules.length > 0) {
                  setSchedules(roleSchedules);
                }
              }
              if (res.announcements && res.announcements.length > 0) {
                setAnnouncements(res.announcements);
              }
            }
          })
          .catch((err) => {
            console.log('Using local session due to dashboard summary load error:', err);
          });
      }
    }
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('classhub_token');
      localStorage.removeItem('classhub_user');
    }
    router.push('/login');
  };

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
      (s.room?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
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
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'overview'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'schedule'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>{currentRole === 'teacher' ? 'Lịch giảng dạy' : 'Lịch học'}</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'courses'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Khóa học</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'messages'
                  ? 'bg-[#009e82] text-white shadow-md shadow-teal-900/30 font-semibold'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Mail className="w-5 h-5" />
              <span>Hộp thư</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'help'
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
                <div className="w-6 h-6 rounded-full bg-[#009e82] text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-teal-950 leading-tight">
                    {user?.name || (currentRole === 'student' ? 'Sinh viên' : 'Giảng viên')}
                  </span>
                  <span className="text-[10px] font-medium text-teal-700/80 leading-tight flex items-center gap-1">
                    {user?.role === 'ADMIN' ? (
                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      currentRole === 'student' ? 'Sinh viên' : 'Giảng viên'
                    )}
                  </span>
                </div>

                {isAdmin ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                ) : (
                  <span title="Vai trò cố định theo tài khoản" className="flex items-center">
                    <Lock className="w-3 h-3 text-slate-400 ml-1" />
                  </span>
                )}
              </button>

              {/* Profile & Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-teal-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Summary Header */}
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center overflow-hidden shrink-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-[#009e82]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user?.name || 'Tài khoản ClassHub'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email || 'user@classhub.edu.vn'}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${user?.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : user?.role === 'TEACHER'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                          {user?.role === 'ADMIN' ? 'Quản trị viên (ADMIN)' : user?.role === 'TEACHER' ? 'Giảng viên' : 'Sinh viên'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Switcher Section */}
                  <div className="py-2">
                    <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Chuyển đổi vai trò</span>
                      {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>

                    {isAdmin ? (
                      /* Admin can switch role */
                      <div className="space-y-1 px-2 mt-1">
                        <button
                          onClick={() => {
                            setCurrentRole('student');
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${currentRole === 'student'
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
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${currentRole === 'teacher'
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
                    ) : (
                      /* Non-admin view - locked message */
                      <div className="mx-3 my-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Vai trò được cố định theo tài khoản. Chỉ <strong>Admin</strong> mới có quyền chuyển đổi.</span>
                      </div>
                    )}
                  </div>

                  {/* Footer & Logout */}
                  <div className="pt-2 border-t border-slate-100 px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD PAGE CONTENT */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
          {activeTab === 'overview' && (
            <>
              {/* Main Title & Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Tổng quan
                  </h2>
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
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${ann.unread ? 'bg-[#009e82]' : 'bg-slate-300'
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
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-800">
                            {currentRole === 'teacher' ? 'Lịch giảng dạy hôm nay' : 'Lịch học hôm nay'}
                          </h3>
                          {currentDateTimeString && (
                            <span className="text-xs text-slate-500">
                              {currentDateTimeString}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('schedule')}
                        className="text-xs text-[#009e82] hover:text-[#02705d] font-medium flex items-center gap-1 hover:underline transition"
                      >
                        <span>Xem tất cả</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Schedule Items List filtered strictly for TODAY */}
                    <div className="space-y-3">
                      {(() => {
                        const todayDayName = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][new Date().getDay()] || 'Thứ Ba';
                        const todaySchedules = filteredSchedules.filter((s) => s.dayName === todayDayName || s.time?.includes(todayDayName));

                        if (todaySchedules.length > 0) {
                          return todaySchedules.map((item) => (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-teal-50/40 hover:border-teal-200 flex items-center justify-between transition-all"
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
                                    className={`text-xs font-bold ${item.completed
                                        ? 'line-through text-slate-400'
                                        : 'text-slate-800'
                                      }`}
                                  >
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    ({item.code}) • {item.credits ? `${item.credits} tín chỉ • ` : ''}Phòng: {item.room || '201'}
                                  </p>
                                </div>
                              </div>

                              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-1 rounded-md shrink-0 ml-3">
                                {item.timeSlot || item.time}
                              </span>
                            </div>
                          ));
                        }

                        return (
                          <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <Clock className="w-6 h-6 text-slate-300" />
                            <span>Hôm nay ({todayDayName}) bạn không có lịch học / giảng dạy.</span>
                            <span className="text-[10px] text-teal-600">Xem Thời khóa biểu hàng tuần ở khung phía dưới.</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK NAV BANNER IN OVERVIEW */}
              <div className="bg-gradient-to-r from-[#01695b] to-[#009e82] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-200 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide text-white">
                      Thời khóa biểu & Quy định thời gian học tập
                    </h3>
                    <p className="text-xs text-emerald-100/90 mt-0.5">
                      Đang có {filteredSchedules.length} môn học trong tuần ({totalCredits} tín chỉ). Xem lịch phân bổ từng ngày và khung giờ học chuẩn.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="px-4 py-2.5 bg-white text-[#009e82] hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
                >
                  Xem lịch học chi tiết →
                </button>
              </div>
            </>
          )}

          {/* TAB 2: LỊCH HỌC / LỊCH GIẢNG DẠY (SCHEDULE) */}
          {activeTab === 'schedule' && (
            <>
              {/* Header Tab Schedule */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {currentRole === 'teacher' ? 'Lịch giảng dạy & Thời khóa biểu' : 'Lịch học & Thời khóa biểu'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Thời khóa biểu học tập phân bổ theo tuần và quy chuẩn khung thời gian học tập
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shadow-xs">
                    Tổng {filteredSchedules.length} môn • {totalCredits} tín chỉ
                  </span>
                </div>
              </div>

              {/* SECTION 1: THỜI KHÓA BIỂU HÀNG TUẦN (PHÂN BỔ ĐỀU CÁC NGÀY) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009e82] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Thời khóa biểu hàng tuần ({currentRole === 'teacher' ? 'Lịch giảng dạy' : 'Lịch học sinh viên'})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Các môn học được phân bổ đều từ Thứ Hai đến Thứ Bảy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timetable Grid grouped by Day of Week (Thứ 2 -> Thứ 7) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'].map((dayName) => {
                    const dayCourses = filteredSchedules.filter((s) => s.dayName === dayName || s.time?.includes(dayName));

                    return (
                      <div
                        key={dayName}
                        className={`rounded-2xl p-4 border transition-all ${dayCourses.length > 0
                            ? 'bg-slate-50/60 border-teal-100 hover:border-teal-300 shadow-sm'
                            : 'bg-slate-50/30 border-slate-100 opacity-60'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                          <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#009e82]" />
                            {dayName}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {dayCourses.length} môn
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {dayCourses.length > 0 ? (
                            dayCourses.map((c) => (
                              <div
                                key={c.id}
                                className="bg-white p-3 rounded-xl border border-teal-100 shadow-xs hover:shadow-md transition-all text-left"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100/70 text-teal-900">
                                    {c.code}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {c.credits || 3} tín chỉ
                                  </span>
                                </div>

                                <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                                  {c.title}
                                </p>

                                <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                                  <p className="flex items-center gap-1 font-medium text-teal-800">
                                    <Clock className="w-3 h-3 text-teal-500" />
                                    {c.timeSlot || c.time}
                                  </p>
                                  <p className="flex items-center gap-1 text-slate-500">
                                    📍 {c.room || 'Phòng học'}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-4 text-center text-[11px] text-slate-400 italic">
                              Không có ca học
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: BẢNG THỜI GIAN HỌC TẬP VÀ GIẢNG DẠY */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    THỜI GIAN HỌC TẬP VÀ GIẢNG DẠY
                  </h3>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-800 font-bold border-b border-slate-200">
                        <th className="border-r border-slate-200 px-4 py-3 text-center w-28 font-bold">Buổi</th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center w-24 font-bold">Ca</th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center w-32 font-bold">Tiết</th>
                        <th className="border-r border-slate-200 px-4 py-3 text-center w-48 font-bold">Thời gian học</th>
                        <th className="px-4 py-3 text-center font-bold">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {/* BUỔI SÁNG */}
                      <tr>
                        <td rowSpan={3} className="border-r border-slate-200 px-4 py-3 text-center font-bold text-slate-800 bg-white align-middle">
                          Sáng
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          1
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center">
                          Tiết 1-3
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          07:00 – 09:40
                        </td>
                        <td className="px-4 py-3 text-left">
                          Nghỉ 5 phút giữa các tiết
                        </td>
                      </tr>
                      <tr className="bg-slate-50/30">
                        <td colSpan={2} className="border-r border-slate-200 px-4 py-2.5 text-center font-bold text-slate-800">
                          Nghỉ
                        </td>
                        <td className="border-r border-slate-200 px-4 py-2.5 text-center font-medium">
                          09:40 – 09:50
                        </td>
                        <td className="px-4 py-2.5 text-left">
                          Nghỉ 10 phút giữa 2 ca buổi sáng
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          2
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center">
                          Tiết 4-6
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          09:50 – 12:30
                        </td>
                        <td className="px-4 py-3 text-left">
                          Nghỉ 5 phút giữa các tiết
                        </td>
                      </tr>

                      {/* BUỔI CHIỀU */}
                      <tr>
                        <td rowSpan={3} className="border-r border-slate-200 px-4 py-3 text-center font-bold text-slate-800 bg-white align-middle">
                          Chiều
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          3
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center">
                          Tiết 7-9
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          13:30 – 16:10
                        </td>
                        <td className="px-4 py-3 text-left">
                          Nghỉ 5 phút giữa các tiết
                        </td>
                      </tr>
                      <tr className="bg-slate-50/30">
                        <td colSpan={2} className="border-r border-slate-200 px-4 py-2.5 text-center font-bold text-slate-800">
                          Nghỉ
                        </td>
                        <td className="border-r border-slate-200 px-4 py-2.5 text-center font-medium">
                          16:10 – 16:20
                        </td>
                        <td className="px-4 py-2.5 text-left">
                          Nghỉ 10 phút giữa 2 ca buổi chiều
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          4
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center">
                          Tiết 10-12
                        </td>
                        <td className="border-r border-slate-200 px-4 py-3 text-center font-medium">
                          16:20 – 19:00
                        </td>
                        <td className="px-4 py-3 text-left">
                          Nghỉ 5 phút giữa các tiết
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Ghi chú chân bảng */}
                <div className="mt-4 space-y-1 text-xs text-slate-500">
                  <p>- Mỗi tiết học kéo dài 50 phút.</p>
                  <p>- Mỗi ca học gồm 3 tiết liên tiếp, có 2 lần nghỉ 5 phút giữa các tiết.</p>
                  <p>- Một buổi học gồm 2 ca, nghỉ 10 phút giữa hai ca.</p>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: KHÓA HỌC (COURSES) */}
          {activeTab === 'courses' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100/80 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009e82] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Danh sách học phần ({filteredSchedules.length} môn • {totalCredits} tín chỉ)
                    </h3>
                    <p className="text-xs text-slate-400">Các môn học đã đăng ký trong chương trình đào tạo</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredSchedules.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-teal-100 bg-slate-50/50 hover:bg-teal-50/30 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">{c.code}</span>
                      <span className="text-xs font-semibold text-emerald-600">{c.credits || 3} tín chỉ</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">{c.title}</h4>
                    <p className="text-xs text-slate-500">📅 {c.dayName || 'Thứ Hai'} • {c.timeSlot || c.time}</p>
                    <p className="text-xs text-slate-500 mt-1">📍 Phòng học: {c.room || '201'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HỘP THƯ / TRỢ GIÚP */}
          {(activeTab === 'messages' || activeTab === 'help') && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-teal-100/80">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#009e82] flex items-center justify-center mx-auto mb-3">
                {activeTab === 'messages' ? <Mail className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {activeTab === 'messages' ? 'Hộp thư liên lạc' : 'Trung tâm hỗ trợ'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeTab === 'messages'
                  ? 'Chức năng gửi nhận thông điệp giữa sinh viên và giảng viên đang được kết nối.'
                  : 'Mọi thắc mắc về đăng ký môn học và thời khóa biểu vui lòng liên hệ phòng Đào tạo.'}
              </p>
            </div>
          )}
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
