'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, ClipboardList, Users, Send, Calendar, FileText } from 'lucide-react';
import { ClassItem, Announcement } from '@/types';

interface ClassDetailsProps {
  classData: ClassItem;
  onBack: () => void;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ classData, onBack }) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      author: classData.teacherName,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      time: '2 giờ trước',
      content: 'Chào cả lớp, tuần này chúng ta sẽ kiểm tra 15 phút phần Tiệm cận hàm số vào tiết thứ 2 nhé!',
      comments: [
        { id: 101, authorName: 'Trần Minh Quân', content: 'Dạ cô cho tụi em xin file đề ôn tập trước được không ạ?' }
      ]
    }
  ]);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    setAnnouncements([
      {
        id: Date.now(),
        author: classData.teacherName,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        time: 'Vừa xong',
        content: newAnnouncement,
        comments: []
      },
      ...announcements
    ]);
    setNewAnnouncement('');
  };

  return (
    <div>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all mb-5 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Bảng điều khiển</span>
      </button>

      {/* Class Banner */}
      <div 
        className="glass-panel h-52 rounded-2xl bg-cover bg-center p-8 flex flex-col justify-end relative mb-6 overflow-hidden"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(11,15,25,0.95) 100%), url(${classData.bannerImage})` }}
      >
        <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white w-fit mb-2">
          {classData.subject}
        </span>
        <h1 className="text-3xl font-extrabold text-white mb-1">{classData.name}</h1>
        <p className="text-gray-400 text-sm">
          Mã Lớp: <strong className="text-indigo-400">{classData.code}</strong> • Phòng: {classData.room} • GV: {classData.teacherName}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'stream' ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Bảng Tin (Stream)</span>
        </button>
        <button 
          onClick={() => setActiveTab('classwork')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'classwork' ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Bài Tập Trên Lớp</span>
        </button>
        <button 
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'people' ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mọi Người ({classData.membersCount})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Create Announcement */}
            <form onSubmit={handlePostAnnouncement} className="glass-panel p-5 rounded-2xl">
              <div className="flex gap-4 mb-4">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" alt="Avatar" className="w-10 h-10 rounded-full" />
                <textarea 
                  rows={2}
                  placeholder="Thông báo tin tức mới cho lớp học của bạn..."
                  className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all resize-none"
                  value={newAnnouncement}
                  onChange={e => setNewAnnouncement(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-sm font-semibold text-white shadow-md">
                  <Send className="w-4 h-4" />
                  <span>Đăng Tin</span>
                </button>
              </div>
            </form>

            {/* Posts */}
            {announcements.map(ann => (
              <div key={ann.id} className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src={ann.avatar} alt="Author" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{ann.author}</h4>
                    <span className="text-xs text-gray-400">{ann.time}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{ann.content}</p>

                <div className="border-t border-white/10 pt-3 space-y-2">
                  {ann.comments.map(cmt => (
                    <div key={cmt.id} className="flex gap-2 bg-white/5 p-2.5 rounded-xl text-xs">
                      <span className="font-bold text-indigo-400">{cmt.authorName}:</span>
                      <span className="text-gray-300">{cmt.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div>
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Sắp Đến Hạn Nộp</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-white block">Bài tập đạo hàm tuần 3</span>
                  <span className="text-[11px] text-amber-400">Hạn: 25/09/2026 - 23:59</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'classwork' && (
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Bài tập tuần 3: Đạo hàm & Tiệm cận hàm số</h4>
                <span className="text-xs text-gray-400">Hạn nộp: 25/09/2026 • 10 Điểm</span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl gradient-primary text-sm font-semibold text-white shadow-md hover:scale-105 transition-all">
              Nộp Bài Tập
            </button>
          </div>
        </div>
      )}

      {activeTab === 'people' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-indigo-400 mb-3">Giáo Viên</h3>
            <div className="flex items-center gap-3 py-2 border-b border-white/10">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" alt="Teacher" className="w-10 h-10 rounded-full" />
              <span className="font-semibold text-white text-sm">{classData.teacherName}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-cyan-400 mb-3">Học Sinh</h3>
            <div className="space-y-2">
              {['Trần Minh Quân', 'Lê Hoàng Nam', 'Nguyễn Phương Anh', 'Phạm Đức Anh'].map((student, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(student)}`} alt="Student" className="w-9 h-9 rounded-full bg-gray-800" />
                  <span className="text-gray-300 text-sm">{student}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
