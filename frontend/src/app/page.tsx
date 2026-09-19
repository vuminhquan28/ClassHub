'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ClipboardList, CheckCircle, Clock, Sparkles, LogIn } from 'lucide-react';
import { Navbar, Sidebar, StatCard, ClassCard, CreateClassModal, ClassDetails } from '@/components';
import { classAPI } from '@/services/api';
import { ClassItem, CreateClassDTO, User } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initial demo data fallback
  const initialClasses: ClassItem[] = [
    {
      id: "cls_101",
      code: "MATH101",
      name: "Toán Hoàn Chỉnh - Lớp 12A1",
      subject: "Toán Học",
      section: "Học Kỳ 1 - 2026",
      room: "Phòng A.204",
      description: "Chương trình Đại số & Hình học nâng cao ôn thi THPT Quốc gia.",
      teacherName: "Cô Nguyễn Thu Hà",
      bannerImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
      membersCount: 35
    },
    {
      id: "cls_102",
      code: "PHYS202",
      name: "Vật Lý Đại Cương & Thí Nghiệm",
      subject: "Vật Lý",
      section: "Khóa Hè 2026",
      room: "Phòng Lab B.102",
      description: "Tìm hiểu cơ học, quang học và các thí nghiệm vật lý tương tác.",
      teacherName: "Cô Nguyễn Thu Hà",
      bannerImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
      membersCount: 28
    },
    {
      id: "cls_103",
      code: "ENG301",
      name: "Tiếng Anh Giao Tiếp & IELTS",
      subject: "Ngoại Ngữ",
      section: "Lớp Chiều T3-T5",
      room: "Phòng C.301",
      description: "Rèn luyện kỹ năng Speaking & Writing chuẩn quốc tế.",
      teacherName: "Cô Nguyễn Thu Hà",
      bannerImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
      membersCount: 42
    }
  ];

  useEffect(() => {
    classAPI.getAll()
      .then(res => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
        } else {
          setClasses(initialClasses);
        }
      })
      .catch(() => {
        setClasses(initialClasses);
      });
  }, []);

  const handleCreateClass = async (formData: CreateClassDTO) => {
    try {
      const res = await classAPI.create(formData);
      if (res.class) {
        setClasses([res.class, ...classes]);
      }
    } catch (err) {
      const newCls: ClassItem = {
        id: `cls_${Date.now()}`,
        code: `CLASS${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        subject: formData.subject,
        section: formData.section || 'Học kỳ 1 - 2026',
        room: formData.room || 'Phòng Học',
        description: formData.description,
        teacherName: currentUser?.name || "Cô Nguyễn Thu Hà",
        bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        membersCount: 1
      };
      setClasses([newCls, ...classes]);
    }
  };

  const handleJoinClass = async (code: string) => {
    try {
      const res = await classAPI.join(code);
      if (res.class) {
        alert(res.message);
      }
    } catch (err) {
      alert(`Đã gửi yêu cầu tham gia lớp học mã [${code}]!`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedClass(null);
      }} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          onOpenModal={() => setIsModalOpen(true)} 
          currentUser={currentUser}
        />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {selectedClass ? (
            <ClassDetails 
              classData={selectedClass} 
              onBack={() => setSelectedClass(null)} 
            />
          ) : (
            <div>
              {/* Hero Banner */}
              <div className="gradient-primary/20 border border-indigo-500/30 rounded-2xl p-8 flex justify-between items-center mb-8 relative overflow-hidden backdrop-blur-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ClassHub Portal System Active</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-white mb-2">
                    Xin chào, {currentUser?.name || 'Cô Nguyễn Thu Hà'}! 👋
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Chào mừng bạn trở lại với hệ thống quản lý lớp học trực tuyến ClassHub.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => router.push('/login')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Trang Đăng Nhập (/login)</span>
                  </button>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
                  >
                    + Tạo Lớp Mới
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Tổng Số Lớp Học" value={classes.length} subtext="Đang hoạt động kỳ này" icon={BookOpen} color="99, 102, 241" />
                <StatCard title="Bài Tập Đang Mở" value="5" subtext="2 bài cần chấm điểm" icon={ClipboardList} color="6, 182, 212" />
                <StatCard title="Tỷ Lệ Điểm Danh" value="98.5%" subtext="Tăng 2% so với tuần trước" icon={CheckCircle} color="16, 185, 129" />
                <StatCard title="Hạn Nộp Sắp Tới" value="23 Tháng 9" subtext="2 Bài tập toán & lý" icon={Clock} color="245, 158, 11" />
              </div>

              {/* Classes Section Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Danh Sách Lớp Học</h2>
                  <p className="text-xs text-gray-400">Chọn lớp học để xem luồng thảo luận và quản lý bài tập</p>
                </div>
              </div>

              {/* Class Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(cls => (
                  <ClassCard key={cls.id} classData={cls} onSelectClass={(selected) => setSelectedClass(selected)} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateClass={handleCreateClass}
        onJoinClass={handleJoinClass}
      />
    </div>
  );
}
