'use client';

import React, { useState } from 'react';
import { Users, Copy, Check, ArrowRight, BookOpen } from 'lucide-react';
import { ClassItem } from '@/types';

interface ClassCardProps {
  classData: ClassItem;
  onSelectClass: (classData: ClassItem) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classData, onSelectClass }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(classData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={() => onSelectClass(classData)}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col relative cursor-pointer"
    >
      <div 
        className="h-32 relative bg-cover bg-center p-4 flex flex-col justify-between"
        style={{ backgroundImage: `url(${classData.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#111827]/95" />
        <div className="relative z-10">
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white inline-block mb-1">
            {classData.subject}
          </span>
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">{classData.name}</h3>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <p className="text-xs text-gray-400 min-h-[2.5rem] line-clamp-2 leading-relaxed">
          {classData.description || 'Không có mô tả chi tiết cho lớp học này.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{classData.section}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{classData.membersCount} Thành viên</span>
          </div>
        </div>

        <div 
          onClick={handleCopyCode}
          className="flex items-center justify-between bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition-all"
          title="Bấm để copy mã lớp"
        >
          <span className="text-gray-400">Mã Lớp: <strong className="text-indigo-400 tracking-wider ml-1">{classData.code}</strong></span>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-3.5 flex items-center justify-between text-xs">
        <span className="text-gray-400">GV: {classData.teacherName}</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 font-semibold transition-all">
          <span>Vào Lớp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
