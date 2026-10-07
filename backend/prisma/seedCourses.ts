import { prisma } from '../src/config/prisma.js';

interface CourseInput {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
}

const courseData: CourseInput[] = [
  { code: 'GEN101', name: 'Triết học Mác – Lênin', credits: 3, prerequisites: [] },
  { code: 'GEN102', name: 'Kinh tế chính trị Mác – Lênin', credits: 2, prerequisites: ['GEN101'] },
  { code: 'GEN103', name: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, prerequisites: [] },
  { code: 'GEN104', name: 'Tư tưởng Hồ Chí Minh', credits: 2, prerequisites: [] },
  { code: 'GEN105', name: 'Chủ nghĩa xã hội khoa học', credits: 2, prerequisites: [] },
  { code: 'ENG101', name: 'Tiếng Anh B1', credits: 5, prerequisites: [] },
  { code: 'GEN106', name: 'Nhập môn công nghệ số và AI', credits: 3, prerequisites: [] },
  { code: 'LAW101', name: 'Nhà nước và pháp luật đại cương', credits: 2, prerequisites: [] },
  { code: 'MAT101', name: 'Đại số tuyến tính', credits: 5, prerequisites: [] },
  { code: 'MAT102', name: 'Giải tích 1', credits: 5, prerequisites: [] },
  { code: 'MAT103', name: 'Giải tích 2', credits: 5, prerequisites: ['MAT102'] },
  { code: 'PHY101', name: 'Vật lý đại cương 1', credits: 3, prerequisites: [] },
  { code: 'PHY102', name: 'Vật lý đại cương 2', credits: 3, prerequisites: ['PHY101'] },
  { code: 'CS101', name: 'Tư duy tính toán', credits: 5, prerequisites: [] },
  { code: 'MAT104', name: 'Xác suất thống kê', credits: 3, prerequisites: ['MAT102'] },
  { code: 'CS102', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, prerequisites: ['CS101'] },
  { code: 'MAT105', name: 'Toán học rời rạc', credits: 3, prerequisites: ['MAT101'] },
  { code: 'CS201', name: 'Lập trình nâng cao', credits: 3, prerequisites: ['CS101'] },
  { code: 'DB201', name: 'Cơ sở dữ liệu', credits: 3, prerequisites: [] },
  { code: 'NET201', name: 'Mạng máy tính', credits: 3, prerequisites: ['CS101'] },
  { code: 'SE201', name: 'Công nghệ phần mềm', credits: 3, prerequisites: ['CS201'] },
  { code: 'AI201', name: 'Trí tuệ nhân tạo', credits: 3, prerequisites: ['CS102'] },
  { code: 'OS201', name: 'Nguyên lý hệ điều hành', credits: 3, prerequisites: [] },
  { code: 'CE201', name: 'Kiến trúc máy tính', credits: 3, prerequisites: ['CS101'] },
  { code: 'AI202', name: 'Học máy', credits: 3, prerequisites: ['CS101', 'MAT104'] },
  { code: 'MAT201', name: 'Tối ưu hóa', credits: 3, prerequisites: ['CS102', 'MAT105'] },
  { code: 'SE301', name: 'Phân tích và thiết kế hệ thống', credits: 3, prerequisites: ['SE201'] },
  { code: 'SE302', name: 'Phân tích và kiểm thử chương trình', credits: 3, prerequisites: ['CS201'] },
  { code: 'RES301', name: 'Thực hành nghiên cứu', credits: 3, prerequisites: ['ADV301'] },
  { code: 'ADV301', name: 'Các vấn đề hiện đại CNTT', credits: 3, prerequisites: ['GEN106'] },
  { code: 'SYS301', name: 'Lập trình hệ thống', credits: 3, prerequisites: ['CS101'] },
  { code: 'COM301', name: 'Chương trình dịch', credits: 3, prerequisites: ['CS102'] },
  { code: 'APP301', name: 'Phát triển ứng dụng đa nền tảng', credits: 3, prerequisites: ['SE201'] },
  { code: 'PM301', name: 'Quản lý dự án CNTT', credits: 3, prerequisites: ['SE201'] },
  { code: 'SE303', name: 'Thiết kế hệ thống phần mềm lớn', credits: 3, prerequisites: ['SE301'] },
  { code: 'AI303', name: 'Phát triển hệ thống AI', credits: 3, prerequisites: ['SE201'] },
  { code: 'API301', name: 'Thiết kế và triển khai API', credits: 3, prerequisites: ['SE201'] },
  { code: 'UI301', name: 'Thiết kế giao diện người dùng', credits: 3, prerequisites: ['SE201'] },
  { code: 'SE304', name: 'Yêu cầu cho hệ thống phần mềm', credits: 3, prerequisites: ['SE201'] },
  { code: 'SE305', name: 'Phương pháp hình thức', credits: 3, prerequisites: ['MAT105'] },
  { code: 'AI304', name: 'Tính toán khoa học cho ML', credits: 3, prerequisites: ['MAT103', 'MAT101'] },
  { code: 'AI305', name: 'Xử lý ngôn ngữ tự nhiên', credits: 3, prerequisites: ['CS102'] },
  { code: 'AI306', name: 'Học sâu', credits: 3, prerequisites: ['AI202'] },
  { code: 'AI307', name: 'Xử lý ảnh và thị giác máy tính', credits: 3, prerequisites: ['CS102'] },
  { code: 'UI302', name: 'Tương tác người máy', credits: 3, prerequisites: ['SE201'] },
  { code: 'DS301', name: 'Khai phá dữ liệu', credits: 3, prerequisites: ['DB201', 'MAT104'] },
  { code: 'DS302', name: 'Tin sinh học ứng dụng', credits: 3, prerequisites: ['SE201'] },
  { code: 'DS303', name: 'Phân tích dữ liệu lớn', credits: 3, prerequisites: ['DS301'] },
  { code: 'BC301', name: 'Công nghệ Blockchain', credits: 3, prerequisites: [] },
  { code: 'BI301', name: 'Trí tuệ kinh doanh', credits: 3, prerequisites: ['DB201'] },
  { code: 'BA301', name: 'Phân tích kinh doanh', credits: 3, prerequisites: ['DB201', 'MAT104'] },
  { code: 'SEC301', name: 'An toàn và an ninh mạng', credits: 3, prerequisites: ['NET201'] },
  { code: 'SEC302', name: 'Quản trị hệ thống', credits: 3, prerequisites: ['NET201'] },
  { code: 'CLOUD301', name: 'Điện toán đám mây', credits: 3, prerequisites: ['NET201'] },
  { code: 'SEC303', name: 'Giám sát an ninh mạng', credits: 3, prerequisites: ['NET201'] },
  { code: 'SYS302', name: 'Triển khai và tối ưu hệ thống lớn', credits: 3, prerequisites: ['NET201', 'CS101'] },
  { code: 'IOT301', name: 'Phát triển ứng dụng IoT', credits: 3, prerequisites: ['CS101'] },
  { code: 'SKILL301', name: 'Kỹ năng bổ trợ', credits: 3, prerequisites: [] },
  { code: 'INT401', name: 'Thực tập doanh nghiệp – IT', credits: 3, prerequisites: ['RES301'] },
  { code: 'THESIS401', name: 'Khóa luận tốt nghiệp – IT', credits: 10, prerequisites: ['RES301'] },
  { code: 'CAP401', name: 'Dự án tốt nghiệp – CS', credits: 4, prerequisites: ['RES301'] }
];

const dayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const dayOfWeekNums = [2, 3, 4, 5, 6, 7];
const timeSlots = ['07:30 - 09:30', '09:45 - 11:45', '13:30 - 15:30', '15:45 - 17:45'];
const rooms = [
  'Phòng 201', 'Phòng 202', 'Phòng 301', 'Phòng 305',
  'Lab 101', 'Lab 202', 'Lab 303', 'Lab 402',
  'Hội trường A', 'Phòng Máy 501'
];

async function seedCourses() {
  console.log('📚 Bắt đầu cập nhật thông tin tín chỉ & Lịch học phân bổ đều các ngày cho 61 môn học...');

  const courseMap = new Map<string, number>();

  for (let idx = 0; idx < courseData.length; idx++) {
    const item = courseData[idx];

    // Distribute evenly across Mon-Sat and 4 time slots
    const dayIdx = idx % 6;
    const dayOfWeek = dayOfWeekNums[dayIdx];
    const dayName = dayNames[dayIdx];
    const slotIdx = Math.floor(idx / 6) % 4;
    const timeSlot = timeSlots[slotIdx];
    const roomIdx = idx % rooms.length;
    const room = rooms[roomIdx];

    const course = await prisma.course.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        credits: item.credits,
        dayOfWeek,
        dayName,
        timeSlot,
        room
      },
      create: {
        code: item.code,
        name: item.name,
        credits: item.credits,
        dayOfWeek,
        dayName,
        timeSlot,
        room
      }
    });
    courseMap.set(course.code, course.id);
  }

  console.log(`✅ Đã phân bổ thời khóa biểu cân bằng các ngày (Thứ 2 - Thứ 7) cho ${courseMap.size} môn học.`);

  // Create CoursePrerequisite relationships
  let prereqCount = 0;
  for (const item of courseData) {
    const courseId = courseMap.get(item.code);
    if (!courseId) continue;

    for (const prereqCode of item.prerequisites) {
      const prerequisiteId = courseMap.get(prereqCode);
      if (!prerequisiteId) continue;

      await prisma.coursePrerequisite.upsert({
        where: {
          courseId_prerequisiteId: {
            courseId,
            prerequisiteId
          }
        },
        update: {},
        create: {
          courseId,
          prerequisiteId
        }
      });
      prereqCount++;
    }
  }

  console.log(`✅ Đã đồng bộ ${prereqCount} liên kết môn tiên quyết.`);
}

seedCourses()
  .catch((err) => {
    console.error('❌ Lỗi khi cập nhật thời khóa biểu môn học:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
