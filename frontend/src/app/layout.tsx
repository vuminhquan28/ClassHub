import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'] 
});

export const metadata: Metadata = {
  title: 'ClassHub - Quản Lý Lớp Học & Học Tập Thông Minh',
  description: 'Hệ thống quản lý lớp học hiện đại tích hợp Next.js 15, React 19, TypeScript và Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${plusJakartaSans.className} antialiased bg-[#0b0f19] text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
