import { prisma } from '../src/config/prisma.js';

async function seedAssignments() {
  console.log('🚀 Bắt đầu gán môn học cho Giảng viên và Đăng ký môn cho Sinh viên...');

  // 1. Fetch Teachers and Courses
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    orderBy: { id: 'asc' }
  });

  const courses = await prisma.course.findMany({
    orderBy: { code: 'asc' }
  });

  console.log(`Tìm thấy ${teachers.length} Giảng viên và ${courses.length} Môn học.`);

  const courseMap = new Map<string, typeof courses[0]>();
  courses.forEach((c) => courseMap.set(c.code, c));

  // Domain groupings for Teachers
  const teacherDomains: string[][] = [
    // Teacher 1: Lý luận chính trị & Pháp luật
    ['GEN101', 'GEN102', 'GEN103', 'GEN104', 'GEN105', 'LAW101'],
    // Teacher 2: Toán học
    ['MAT101', 'MAT102', 'MAT103', 'MAT104', 'MAT105', 'MAT201'],
    // Teacher 3: Vật lý, Tiếng Anh & Kỹ năng
    ['PHY101', 'PHY102', 'ENG101', 'SKILL301', 'GEN106'],
    // Teacher 4: Khoa học máy tính & Hệ thống
    ['CS101', 'CS102', 'CS201', 'OS201', 'CE201', 'SYS301', 'COM301'],
    // Teacher 5: Công nghệ phần mềm
    ['SE201', 'SE301', 'SE302', 'SE303', 'SE304', 'SE305', 'APP301', 'PM301'],
    // Teacher 6: Trí tuệ nhân tạo & Học máy
    ['AI201', 'AI202', 'AI303', 'AI304', 'AI305', 'AI306', 'AI307'],
    // Teacher 7: Cơ sở dữ liệu & Phân tích dữ liệu
    ['DB201', 'DS301', 'DS302', 'DS303', 'BI301', 'BA301'],
    // Teacher 8: Mạng máy tính & An ninh mạng
    ['NET201', 'SEC301', 'SEC302', 'SEC303', 'CLOUD301', 'SYS302'],
    // Teacher 9: IoT & Giao diện ứng dụng
    ['BC301', 'IOT301', 'API301', 'UI301', 'UI302', 'ADV301'],
    // Teacher 10: Thực tập & Đồ án tốt nghiệp
    ['RES301', 'INT401', 'THESIS401', 'CAP401']
  ];

  // Clear existing teacher assignments & student enrollments for clean seed
  await prisma.teacherCourse.deleteMany({});
  await prisma.studentEnrollment.deleteMany({});

  // Seed Teacher Courses
  let teacherCourseCount = 0;
  for (let i = 0; i < teachers.length; i++) {
    const teacher = teachers[i];
    const codes = teacherDomains[i % teacherDomains.length] || [];

    for (const code of codes) {
      const course = courseMap.get(code);
      if (!course) continue;

      await prisma.teacherCourse.create({
        data: {
          teacherId: teacher.id,
          courseId: course.id
        }
      });
      teacherCourseCount++;
    }
  }
  console.log(`✅ Đã phân công ${teacherCourseCount} môn học cho 10 Giảng viên (mỗi GV đảm nhận 1 nhóm chuyên ngành).`);

  // 2. Fetch Students and enroll courses (11 - 23 credits per student)
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { id: 'asc' }
  });

  console.log(`Bắt đầu đăng ký môn học cho ${students.length} Sinh viên...`);

  let totalEnrollments = 0;
  let minCreditsFound = Infinity;
  let maxCreditsFound = -Infinity;

  for (const student of students) {
    // Shuffle courses copy for randomness
    const shuffled = [...courses].sort(() => 0.5 - Math.random());

    let currentCredits = 0;
    const selectedCourses: typeof courses = [];

    // Random target credits between 11 and 23
    const targetCredits = Math.floor(Math.random() * (23 - 11 + 1)) + 11; // 11..23

    for (const course of shuffled) {
      if (currentCredits + course.credits <= targetCredits) {
        selectedCourses.push(course);
        currentCredits += course.credits;
      }
      if (currentCredits >= 11 && currentCredits >= targetCredits) {
        break;
      }
    }

    // Safety fallback: ensure at least 11 credits
    if (currentCredits < 11) {
      for (const course of shuffled) {
        if (!selectedCourses.some((sc) => sc.id === course.id)) {
          selectedCourses.push(course);
          currentCredits += course.credits;
          if (currentCredits >= 11 && currentCredits <= 23) break;
        }
      }
    }

    if (currentCredits < minCreditsFound) minCreditsFound = currentCredits;
    if (currentCredits > maxCreditsFound) maxCreditsFound = currentCredits;

    for (const course of selectedCourses) {
      await prisma.studentEnrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id
        }
      });
      totalEnrollments++;
    }
  }

  console.log(`✅ Đã đăng ký thành công ${totalEnrollments} lượt môn học cho ${students.length} sinh viên.`);
  console.log(`📊 Số tín chỉ tối thiểu của 1 sinh viên: ${minCreditsFound} tín chỉ`);
  console.log(`📊 Số tín chỉ tối đa của 1 sinh viên: ${maxCreditsFound} tín chỉ`);
}

seedAssignments()
  .catch((e) => {
    console.error('❌ Lỗi khi gán môn học:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
