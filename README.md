# ClassHub - Hệ Thống Quản Lý Lớp Học Trực Tuyến & Cổng Thông Tin

Hệ thống quản lý lớp học **ClassHub** với giao diện portal hiện đại (Teal/Mint Theme), hỗ trợ song song 2 vai trò **Sinh viên** và **Giảng viên**. Dự án được xây dựng theo kiến trúc Monorepo kết hợp giữa **Backend (Node.js, Express, TypeScript)** và **Frontend (Next.js 16, React 19, TailwindCSS)**.

---

## 📌 Các Tính Năng Chính
- 🎨 **Giao diện Dashboard (`/dashboard`)**: Portal trường đại học với sidebar ngọc bích, bộ chọn vai trò, thông báo và lịch học/giảng dạy.
- 🎓 **Hỗ trợ Đa vai trò (Sinh viên / Giảng viên)**: Chuyển đổi giữa giao diện Sinh viên (Lịch học) và Giảng viên (Lịch dạy).
- ⚡ **Thao tác nhanh**: Tìm kiếm, thông báo và tạo hoạt động mới (`+ Hoạt động mới`).

---

## 🛠️ Yêu Cầu Môi Trường
- **Node.js**: `v18.0.0` trở lên (khuyên dùng Node 20 LTS)
- **npm**: đi kèm Node.js (`v9.0.0` trở lên)

---

## 📦 Cài Đặt Dependencies (lần đầu)

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## ⚠️ Lưu ý quan trọng: Build ≠ Mở website

`npm run build` **chỉ biên dịch** mã nguồn. Lệnh này **không** khởi động server, nên trình duyệt sẽ báo:

> This site can’t be reached — localhost refused to connect

Sau khi build xong, **bắt buộc** chạy `npm start` (hoặc dùng `npm run dev` khi đang lập trình) thì mới vào được `http://localhost:3000`.

| Mục đích | Lệnh frontend | Có mở localhost không? |
| --- | --- | --- |
| Lập trình / xem giao diện | `npm run dev` | Có — `http://localhost:3000` |
| Biên dịch production | `npm run build` | **Không** — chỉ tạo thư mục `.next/` |
| Chạy bản đã build | `npm start` (sau `npm run build`) | Có — `http://localhost:3000` |

---

## 🏗️ Build Production

Mở 2 terminal (hoặc chạy tuần tự):

### 1. Backend
```bash
cd backend
npm run build
```
Kết quả: TypeScript trong `backend/src/` được biên dịch sang `backend/dist/`.

### 2. Frontend
```bash
cd frontend
npm run build
```
Kết quả: Next.js tối ưu các trang (`/dashboard`, `/login`, `/register`) vào `frontend/.next/`.

Build thành công sẽ in danh sách route, ví dụ:

```text
Route (app)
┌ ○ /
├ ○ /dashboard
├ ○ /login
└ ○ /register
```

---

## 🚀 Chạy Ứng Dụng

### Cách 1: Development (khuyên dùng khi sửa giao diện)

Mở **2 terminal song song**:

**Terminal 1 — Backend (port 5000)**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (port 3000)**
```bash
cd frontend
npm run dev
```

- Trang chủ `/` tự chuyển tới dashboard.
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Đăng nhập: [http://localhost:3000/login](http://localhost:3000/login)
- API: [http://localhost:5000](http://localhost:5000)

Giữ 2 terminal này **mở**. Đóng terminal hoặc dừng process (`Ctrl + C`) thì localhost sẽ không kết nối được.

### Cách 2: Production (sau khi đã `npm run build`)

**Terminal 1 — Backend**
```bash
cd backend
npm start
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```

Rồi mở [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

Nếu port 3000 đang bị chiếm, Next.js có thể chạy port khác (3001, …). Xem dòng `Local:` trên terminal để lấy đúng URL.

---

## 🔧 Xử lý lỗi thường gặp

**`localhost refused to connect`**
1. Chưa chạy `npm run dev` hoặc `npm start` (chỉ mới `npm run build`).
2. Server đã bị tắt (`Ctrl + C`).
3. Đang mở sai cổng (phải là `3000`, trừ khi terminal báo cổng khác).
4. Tường lửa / VPN chặn localhost — thử `http://127.0.0.1:3000/dashboard`.

**`Port 3000 is already in use`**
Đóng process cũ đang chiếm port, hoặc dùng cổng mới mà Next.js gợi ý.

---

## 📁 Cấu Trúc Thư Mục

```text
ClassHub/
├── backend/                  # Node.js Express REST API (TypeScript)
│   ├── src/
│   ├── dist/                 # Output sau npm run build
│   └── package.json
│
├── frontend/                 # Next.js 16 + React 19 + TailwindCSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/    # /dashboard
│   │   │   ├── login/        # /login
│   │   │   ├── register/     # /register
│   │   │   └── page.tsx      # / → redirect /dashboard
│   │   ├── components/
│   │   └── services/
│   └── package.json
│
└── README.md
```
