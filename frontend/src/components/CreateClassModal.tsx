'use client';

import React, { useState } from 'react';
import { X, PlusCircle, LogIn } from 'lucide-react';
import { CreateClassDTO } from '@/types';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (formData: CreateClassDTO) => void;
  onJoinClass: (code: string) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreateClass, onJoinClass }) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [formData, setFormData] = useState<CreateClassDTO & { code: string }>({
    name: '',
    subject: '',
    section: 'Học kỳ 1 - 2026',
    room: '',
    description: '',
    code: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'create') {
      if (!formData.name || !formData.subject) return alert('Vui lòng điền tên lớp và môn học!');
      onCreateClass(formData);
    } else {
      if (!formData.code) return alert('Vui lòng nhập mã lớp học!');
      onJoinClass(formData.code);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="glass-panel w-11/12 max-w-lg p-8 rounded-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-white">
            {tab === 'create' ? 'Tạo Lớp Học Mới' : 'Tham Gia Lớp Học'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button 
            type="button" 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'create' ? 'gradient-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setTab('create')}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo Lớp Mới</span>
          </button>
          <button 
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'join' ? 'gradient-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setTab('join')}
          >
            <LogIn className="w-4 h-4" />
            <span>Nhập Mã Lớp</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'create' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Tên Lớp Học *</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Toán Cao Cấp - Lớp 12A1" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all"
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Môn Học *</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Toán Đại Số" 
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Học Kỳ</label>
                  <input 
                    type="text" 
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Phòng Học</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Phòng A.204"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Mô Tả Lớp Học</label>
                <textarea 
                  rows={3}
                  placeholder="Mô tả tóm tắt nội dung bài giảng..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1.5 py-4">
              <label className="text-xs font-semibold text-gray-300">Nhập Mã Lớp (Class Code) *</label>
              <input 
                type="text" 
                placeholder="Ví dụ: MATH101" 
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-lg text-center tracking-widest text-indigo-400 uppercase font-bold outline-none focus:border-indigo-500 transition-all"
                required 
              />
              <span className="text-xs text-gray-400 mt-1">Yêu cầu giáo viên cung cấp mã lớp 7 ký tự để tham gia.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 transition-all"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl gradient-primary text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all"
            >
              {tab === 'create' ? 'Tạo Lớp Ngay' : 'Tham Gia Lớp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
