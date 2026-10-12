'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Lock,
  Camera,
  Sparkles,
  BookOpen,
  Clock,
  ShieldCheck,
  Check,
  RefreshCw,
  Home
} from 'lucide-react';
import { authAPI } from '@/services/api';
import { User, CourseSummary } from '@/types';

export default function ProfilePage() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'security'>('personal');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / popover for editing avatar URL
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string>('');

  // Editable form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    faculty: '',
    className: '',
    studentCode: '',
    lecturerCode: '',
    academicTitle: '',
    avatarUrl: ''
  });

  // Fetch current user data from API
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // First try fetching latest profile from backend
      const res = await authAPI.getProfile();
      if (res && res.success && res.user) {
        setUser(res.user);
        populateFormData(res.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('classhub_user', JSON.stringify(res.user));
        }
      }
    } catch (error) {
      console.warn('Cannot fetch from API /auth/profile, falling back to localStorage:', error);
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('classhub_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setUser(parsed);
            populateFormData(parsed);
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (u: User) => {
    let formattedDob = '';
    if (u.dateOfBirth) {
      try {
        const d = new Date(u.dateOfBirth);
        if (!isNaN(d.getTime())) {
          formattedDob = d.toISOString().split('T')[0];
        }
      } catch {
        formattedDob = '';
      }
    }

    setFormData({
      fullName: u.fullName || u.name || '',
      phone: u.phone || '',
      gender: u.gender || '',
      dateOfBirth: formattedDob,
      address: u.address || '',
      faculty: u.faculty || '',
      className: u.className || '',
      studentCode: u.studentCode || '',
      lecturerCode: u.lecturerCode || '',
      academicTitle: u.academicTitle || '',
      avatarUrl: u.avatarUrl || ''
    });
    setTempAvatarUrl(u.avatarUrl || '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveLoading(true);
    setStatusMessage(null);

    try {
      const payload: Partial<User> = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
        address: formData.address || null,
        faculty: formData.faculty || null,
        className: formData.className || null,
        studentCode: formData.studentCode || null,
        lecturerCode: formData.lecturerCode || null,
        academicTitle: formData.academicTitle || null,
        avatarUrl: formData.avatarUrl || null
      };

      const res = await authAPI.updateProfile(payload);
      if (res && res.success && res.user) {
        setUser(res.user);
        populateFormData(res.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('classhub_user', JSON.stringify(res.user));
        }
        setIsEditing(false);
        setStatusMessage({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        throw new Error(res.message || 'Cập nhật thất bại');
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Không thể cập nhật hồ sơ, vui lòng thử lại!' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      populateFormData(user);
    }
    setIsEditing(false);
    setStatusMessage(null);
  };

  // Format date helper: DD/MM/YYYY
  const formatDateDisplay = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return null;
    }
  };

  // Calculate Profile Completion Progress
  const isTeacher = user?.role === 'TEACHER';
  const roleName = isTeacher ? 'Giảng viên' : user?.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên';

  const calculateCompletion = () => {
    if (!user) return 0;
    const requiredFields = isTeacher
      ? [
          user.fullName || user.name,
          user.email,
          user.phone,
          user.lecturerCode,
          user.dateOfBirth,
          user.gender,
          user.address,
          user.faculty,
          user.academicTitle,
          user.avatarUrl
        ]
      : [
          user.fullName || user.name,
          user.email,
          user.phone,
          user.studentCode,
          user.dateOfBirth,
          user.gender,
          user.address,
          user.faculty,
          user.className,
          user.avatarUrl
        ];

    const filled = requiredFields.filter((f) => f && String(f).trim().length > 0).length;
    return Math.round((filled / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf6f4] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#009e82]/30 border-t-[#009e82] rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-sm">Đang tải thông tin hồ sơ cá nhân...</p>
      </div>
    );
  }

  const currentAvatar =
    user?.avatarUrl ||
    user?.avatar ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.fullName || user?.name || 'ClassHub')}`;

  return (
    <div className="min-h-screen bg-[#edf6f4] text-slate-800 font-sans selection:bg-[#009e82] selection:text-white">
      {/* Top Header Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-teal-800 hover:bg-teal-50 border border-teal-200/60 font-semibold text-xs sm:text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#009e82]" />
              <span className="hidden sm:inline">Bảng điều khiển</span>
              <span className="sm:hidden">Quay lại</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span 
                onClick={() => router.push('/dashboard')}
                className="hover:text-teal-700 cursor-pointer flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" /> Trang chủ
              </span>
              <span>/</span>
              <span className="text-teal-800 font-bold">Hồ sơ cá nhân</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009e82] hover:bg-[#01866f] text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-900/10 hover:shadow-lg transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saveLoading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#009e82] hover:bg-[#01866f] text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-900/20 transition disabled:opacity-50"
                >
                  {saveLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Toast Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-sm font-semibold">{statusMessage.text}</p>
          </div>
        )}

        {/* Hero Card: Title & Profile Progress */}
        <section className="bg-gradient-to-r from-[#014e43] via-[#025a4d] to-[#013d34] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-emerald-300 border border-teal-300/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {roleName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đang hoạt động
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Hồ sơ cá nhân
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
                Cổng thông tin quản lý hồ sơ định danh và thông tin công tác/học tập tại ClassHub
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-teal-300/20 w-full md:w-80 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Tiến độ hoàn thiện hồ sơ
                </span>
                <span className="text-xs font-extrabold text-emerald-300">
                  {completionPercentage}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-2">
                {completionPercentage === 100
                  ? 'Tuyệt vời! Hồ sơ của bạn đã được cập nhật đầy đủ.'
                  : 'Vui lòng bổ sung đầy đủ thông tin để hoàn thiện hồ sơ.'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 pt-4 border-t border-teal-500/20 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'bg-white text-[#014e43] shadow-md font-extrabold'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'academic'
                  ? 'bg-white text-[#014e43] shadow-md font-extrabold'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isTeacher ? 'Hồ sơ công tác' : 'Hồ sơ học tập'}</span>
              {user?.courses && user.courses.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-500/30 text-emerald-200">
                  {user.courses.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-white text-[#014e43] shadow-md font-extrabold'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Bảo mật & Tài khoản</span>
            </button>
          </div>
        </section>

        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Avatar & Photo Card (4x6 style) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm flex flex-col items-center text-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 self-start">
                  Ảnh hồ sơ
                </h3>

                {/* 4x6 / Portrait Framed Photo Box */}
                <div className="relative group">
                  <div className="w-44 h-56 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-teal-200 overflow-hidden shadow-inner flex flex-col items-center justify-center p-1">
                    <img
                      src={currentAvatar}
                      alt="Ảnh thẻ cá nhân"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Change photo button overlay */}
                  <button
                    onClick={() => {
                      setTempAvatarUrl(user?.avatarUrl || '');
                      setShowAvatarModal(true);
                    }}
                    className="absolute bottom-2 right-2 p-2.5 rounded-full bg-[#009e82] hover:bg-[#01866f] text-white shadow-lg shadow-teal-900/30 hover:scale-105 transition-all"
                    title="Cập nhật ảnh đại diện"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 font-medium">
                  Ảnh thẻ hồ sơ (Tỷ lệ 3:4 hoặc 4:6)
                </p>

                <div className="w-full mt-5 pt-5 border-t border-slate-100 text-left space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Họ và tên đầy đủ:</span>
                    <p className="text-sm font-bold text-slate-800">
                      {user?.fullName || user?.name || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isTeacher ? 'Mã giảng viên:' : 'Mã sinh viên:'}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 font-mono">
                      {(isTeacher ? user?.lecturerCode : user?.studentCode) || (
                        <span className="text-slate-400 italic font-normal text-xs">Chưa cập nhật</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Vai trò hệ thống:</span>
                    <div className="mt-0.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-100">
                        {roleName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Summary Card */}
              <div className="bg-white rounded-3xl p-5 border border-teal-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#009e82]" /> Xác thực thông tin
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thông tin hồ sơ được bảo mật theo quy định đào tạo. Mọi điều chỉnh về thông tin cá nhân cần đảm bảo tính trung thực.
                </p>
              </div>
            </div>

            {/* Right Column: 2-Column Information Grid */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-8">
                {/* Section 1: Thông tin định danh */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#009e82]" />
                      Thông tin định danh & đơn vị
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {isEditing ? 'Đang ở chế độ chỉnh sửa' : 'Chế độ xem'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Field 1: Mã sinh viên / Mã giảng viên */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                        <span>{isTeacher ? 'Mã giảng viên' : 'Mã sinh viên'}</span>
                        {!isEditing && <Lock className="w-3 h-3 text-slate-400" />}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={isTeacher ? formData.lecturerCode : formData.studentCode}
                          onChange={(e) =>
                            handleInputChange(
                              isTeacher ? 'lecturerCode' : 'studentCode',
                              e.target.value
                            )
                          }
                          placeholder={isTeacher ? 'Ví dụ: GV102' : 'Ví dụ: 23020142'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-mono font-medium text-slate-800 flex items-center justify-between">
                          <span>
                            {(isTeacher ? user?.lecturerCode : user?.studentCode) || (
                              <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Field 2: Khoa / Bộ môn / Ngành học */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{isTeacher ? 'Khoa / Bộ môn' : 'Ngành học / Khoa'}</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.faculty}
                          onChange={(e) => handleInputChange('faculty', e.target.value)}
                          placeholder="Ví dụ: Công nghệ thông tin"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                          {user?.faculty || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field 3: Lớp hành chính (Dành cho Sinh viên) HOẶC Học vị (Dành cho Giảng viên) */}
                    {!isTeacher ? (
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600">
                          Lớp hành chính / Lớp sinh hoạt
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.className}
                            onChange={(e) => handleInputChange('className', e.target.value)}
                            placeholder="Ví dụ: K68-CACLC1 hoặc QH-2023-I/CQ-CLC"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                            {user?.className || (
                              <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>Học vị / Chức danh</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.academicTitle}
                            onChange={(e) => handleInputChange('academicTitle', e.target.value)}
                            placeholder="Ví dụ: Tiến sĩ, Thạc sĩ, PGS.TS"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                            {user?.academicTitle || (
                              <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Thông tin cơ bản */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-[#009e82]" />
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Field: Họ và tên */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Nhập họ và tên..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-bold text-slate-800">
                          {user?.fullName || user?.name || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field: Ngày sinh */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>Ngày sinh</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                          {formatDateDisplay(user?.dateOfBirth) || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field: Giới tính */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600">
                        Giới tính
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        >
                          <option value="">-- Chọn giới tính --</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                          {user?.gender || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Thông tin liên hệ */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#009e82]" />
                      Thông tin liên hệ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Field: Email cá nhân (Email chính đăng nhập - Luôn chỉ đọc) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-teal-600" />
                          <span>Email cá nhân (Tài khoản)</span>
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Cố định
                        </span>
                      </label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 flex items-center justify-between cursor-not-allowed">
                        <span className="truncate">{user?.email || 'Chưa cập nhật'}</span>
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Email dùng để đăng nhập và nhận thông báo bảo mật.
                      </p>
                    </div>

                    {/* Field: Số điện thoại */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>Số điện thoại (Di động)</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Nhập số điện thoại..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                          {user?.phone || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field: Địa chỉ liên hệ */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>Địa chỉ liên hệ thường trú / tạm trú</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Ví dụ: Số 144 Xuân Thủy, Cầu Giấy, Hà Nội"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                          {user?.address || (
                            <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar when Editing */}
                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saveLoading}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#009e82] hover:bg-[#01866f] text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-900/20 transition disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Lưu thông tin hồ sơ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HỒ SƠ HỌC TẬP / HỒ SƠ CÔNG TÁC */}
        {activeTab === 'academic' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#009e82]" />
                  {isTeacher ? 'Danh mục học phần giảng dạy' : 'Danh mục học phần đang theo học'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dữ liệu được trích xuất trực tiếp từ cơ sở dữ liệu đào tạo ClassHub
                </p>
              </div>

              {/* Statistics Counter */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200/60 text-center">
                  <span className="text-[10px] text-teal-700 font-medium block">Tổng số môn</span>
                  <span className="text-sm font-extrabold text-teal-950">
                    {user?.courses ? user.courses.length : 0} môn
                  </span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-center">
                  <span className="text-[10px] text-emerald-700 font-medium block">Tổng tín chỉ</span>
                  <span className="text-sm font-extrabold text-emerald-950">
                    {user?.courses?.reduce((acc, c) => acc + (c.credits || 0), 0) || 0} tín chỉ
                  </span>
                </div>
              </div>
            </div>

            {/* Courses List */}
            {user?.courses && user.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.courses.map((course: CourseSummary, idx: number) => (
                  <div
                    key={course.id || idx}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-teal-100/70 text-[#009e82] text-xs font-mono font-bold">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {course.credits} tín chỉ
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        {course.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{course.dayName || 'Thứ Hai'} • {course.timeSlot || '07:30'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate">{course.room || 'Phòng 201'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">Chưa có dữ liệu học phần</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tài khoản hiện chưa được đăng ký lớp học hoặc phân công giảng dạy trong học kỳ này.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BẢO MẬT & TÀI KHOẢN */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#009e82]" />
                Thông tin tài khoản & Bảo mật
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Quản lý các thông số an toàn và trạng thái tài khoản ClassHub
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500">ID Người Dùng</span>
                <p className="text-sm font-mono font-bold text-slate-800">#{user?.id}</p>
                <p className="text-[11px] text-slate-400">Định danh duy nhất trong hệ cơ sở dữ liệu PostgreSQL</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500">Thời Gian Tạo Tài Khoản</span>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Ghi nhận từ hệ thống'}
                </p>
                <p className="text-[11px] text-slate-400">Ngày tài khoản được kích hoạt trên ClassHub</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500">Trạng Thái Xác Thực Mật Khẩu</span>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bảo mật bằng mã hóa Bcrypt (Salt rounds 10)</span>
                </div>
                <p className="text-[11px] text-slate-400">Mật khẩu được lưu trữ an toàn dưới dạng băm một chiều</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500">Quyền Hạn Đăng Nhập</span>
                <p className="text-sm font-bold text-slate-800">{user?.role}</p>
                <p className="text-[11px] text-slate-400">Được phân quyền bởi hệ thống quản trị đào tạo</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Cập nhật URL ảnh đại diện */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-teal-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#009e82]" /> Cập nhật ảnh hồ sơ
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center py-2">
              <div className="w-24 h-24 rounded-full border-2 border-[#009e82] overflow-hidden shadow-md mb-2">
                <img
                  src={tempAvatarUrl || currentAvatar}
                  alt="Xem trước ảnh"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500">Xem trước ảnh đại diện</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Đường dẫn ảnh (URL):</label>
              <input
                type="text"
                value={tempAvatarUrl}
                onChange={(e) => setTempAvatarUrl(e.target.value)}
                placeholder="Nhập đường dẫn URL ảnh (https://...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009e82]/30 focus:border-[#009e82]"
              />
              <p className="text-[10px] text-slate-400">
                Gợi ý: Bạn có thể nhập link ảnh từ Unsplash, Imgur hoặc link ảnh avatar của bạn.
              </p>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Hoặc chọn mẫu ảnh ngẫu nhiên:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.fullName || 'User1')}`,
                  `https://api.dicebear.com/7.x/bottts/svg?seed=SmartStudent`,
                  `https://api.dicebear.com/7.x/bottts/svg?seed=TeacherPro`,
                  `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
                  `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80`
                ].map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempAvatarUrl(presetUrl)}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-[#009e82] overflow-hidden shrink-0 transition"
                  >
                    <img src={presetUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  setFormData((prev) => ({ ...prev, avatarUrl: tempAvatarUrl }));
                  setShowAvatarModal(false);
                  // Automatically save avatarUrl if not in edit mode
                  if (!isEditing) {
                    try {
                      setSaveLoading(true);
                      const res = await authAPI.updateProfile({ avatarUrl: tempAvatarUrl });
                      if (res.success && res.user) {
                        setUser(res.user);
                        localStorage.setItem('classhub_user', JSON.stringify(res.user));
                        setStatusMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
                        setTimeout(() => setStatusMessage(null), 3000);
                      }
                    } catch (err: any) {
                      setStatusMessage({ type: 'error', text: 'Lỗi khi cập nhật ảnh đại diện' });
                    } finally {
                      setSaveLoading(false);
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#009e82] hover:bg-[#01866f] text-white shadow-md shadow-teal-900/10 transition"
              >
                Áp dụng ảnh này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
