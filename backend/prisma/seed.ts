import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawUser {
  id: number;
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

async function main() {
  console.log('🌱 Bắt đầu import 211 người dùng từ Excel vào Database...');

  const jsonPath = path.join(__dirname, 'mock_users.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const users: RawUser[] = JSON.parse(rawData);

  let successCount = 0;
  let skipCount = 0;

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
      const updatedAt = user.updatedAt ? new Date(user.updatedAt) : new Date();

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          fullName: user.fullName,
          phone: user.phone,
          password: hashedPassword,
          role: user.role,
          updatedAt: updatedAt
        },
        create: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          password: hashedPassword,
          role: user.role,
          createdAt: createdAt,
          updatedAt: updatedAt
        }
      });
      successCount++;
    } catch (err: any) {
      console.error(`❌ Lỗi khi chèn user ID ${user.id} (${user.email}):`, err.message);
      skipCount++;
    }
  }

  // Reset sequence cho Postgres ID autoincrement
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1)) FROM "User";`
    );
  } catch (seqErr) {
    console.log('Thông báo sequence:', seqErr);
  }

  console.log(`✅ Import hoàn tất! Thành công: ${successCount}/${users.length} tài khoản. (Bỏ qua: ${skipCount})`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
