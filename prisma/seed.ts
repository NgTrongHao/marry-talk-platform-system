import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Admin Account
  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const hashedPassword =
    '$2a$12$5OtU8j72ECtZ6Bfz063eauVmLzsH2E6j486lsCKCf2EhD.zBdkAMa';

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      role: 'ADMIN',
      first_name: 'Admin',
      last_name: 'User',
    },
  });

  // Seed Therapy Categories
  const therapies = [
    {
      title: 'Tư vấn tiền hôn nhân',
      description:
        'Chuẩn bị tâm lý và giải quyết các vấn đề trước khi kết hôn.',
    },
    {
      title: 'Tư vấn hôn nhân',
      description: 'Giúp các cặp đôi xử lý xung đột và cải thiện mối quan hệ.',
    },
    {
      title: 'Tư vấn tâm lý cá nhân',
      description: 'Hỗ trợ giải quyết các vấn đề tâm lý và cá nhân.',
    },
    {
      title: 'Tư vấn gia đình',
      description:
        'Giải quyết xung đột và nâng cao sự hiểu biết trong gia đình.',
    },
    {
      title: 'Tư vấn stress và lo âu',
      description: 'Phương pháp giúp kiểm soát căng thẳng và lo âu.',
    },
  ];

  for (const therapy of therapies) {
    await prisma.therapy.upsert({
      where: { title: therapy.title },
      update: {},
      create: therapy,
    });
  }

  // Seed Service Packages
  const servicePackages = [
    { title: 'Gói 1 buổi', sessions: 1 },
    { title: 'Gói 3 buổi', sessions: 3 },
    { title: 'Gói 5 buổi', sessions: 5 },
  ];

  for (const packageData of servicePackages) {
    await prisma.servicePackage.upsert({
      where: { sessions: packageData.sessions },
      update: {},
      create: packageData,
    });
  }

  // Seed Premarital Test Data
  const premaritalTherapy = await prisma.therapy.upsert({
    where: { title: 'Tư vấn tiền hôn nhân' },
    update: {},
    create: {
      title: 'Tư vấn tiền hôn nhân',
      description:
        'Chuẩn bị tâm lý, tài chính và kỹ năng giao tiếp trước khi kết hôn.',
    },
  });

  const testsData = [
    {
      name: 'Bài kiểm tra mức độ hiểu nhau',
      description:
        'Đánh giá mức độ thấu hiểu giữa hai người trong mối quan hệ.',
      questions: [
        {
          question: 'Người ấy thích hoạt động gì nhất vào cuối tuần?',
          type: 'MULTIPLE_CHOICE',
          options: ['Xem phim', 'Đi dã ngoại', 'Ở nhà nghỉ ngơi', 'Đi mua sắm'],
        },
        {
          question: 'Món ăn yêu thích của người ấy là gì?',
          type: 'MULTIPLE_CHOICE',
          options: ['Món Á', 'Món Âu', 'Món Hàn', 'Món chay'],
        },
        {
          question: 'Khi có xung đột, người ấy thường phản ứng như thế nào?',
          type: 'MULTIPLE_CHOICE',
          options: [
            'Tránh né',
            'Thảo luận thẳng thắn',
            'Im lặng suy nghĩ',
            'Nổi giận ngay lập tức',
          ],
        },
        {
          question: 'Người ấy có quan tâm đến tôn giáo không?',
          type: 'SINGLE_CHOICE',
          options: [
            'Có, rất quan trọng',
            'Có, nhưng không ảnh hưởng nhiều',
            'Không quan tâm lắm',
            'Hoàn toàn không quan tâm',
          ],
        },
        {
          question:
            'Bạn nghĩ điều gì quan trọng nhất trong mối quan hệ của hai người?',
          type: 'TEXT',
          options: [],
        },
      ],
    },
    {
      name: 'Bài kiểm tra tài chính gia đình',
      description: 'Đánh giá quan điểm tài chính của hai bạn trước hôn nhân.',
      questions: [
        {
          question: 'Bạn có thói quen tiết kiệm tiền hàng tháng không?',
          type: 'SINGLE_CHOICE',
          options: [
            'Có, rất quan trọng',
            'Có, nhưng không đều đặn',
            'Không, nhưng có kế hoạch',
            'Không, tôi tiêu hết mỗi tháng',
          ],
        },
        {
          question: 'Bạn nghĩ ai nên quản lý tài chính trong gia đình?',
          type: 'SINGLE_CHOICE',
          options: [
            'Chồng',
            'Vợ',
            'Cả hai cùng quản lý',
            'Thuê chuyên gia tài chính',
          ],
        },
        {
          question: 'Quan điểm của bạn về việc vay tiền mua nhà là gì?',
          type: 'SINGLE_CHOICE',
          options: [
            'Hoàn toàn ủng hộ',
            'Chỉ vay nếu cần thiết',
            'Không thích vay nợ',
            'Chưa bao giờ nghĩ đến',
          ],
        },
        {
          question:
            'Bạn cảm thấy thế nào khi người yêu kiếm tiền nhiều hơn bạn?',
          type: 'SINGLE_CHOICE',
          options: [
            'Rất thoải mái',
            'Hơi tự ti',
            'Không quan tâm',
            'Muốn kiếm nhiều hơn để cân bằng',
          ],
        },
        {
          question: 'Mục tiêu tài chính lớn nhất của bạn là gì?',
          type: 'TEXT',
          options: [],
        },
      ],
    },
  ];

  for (const testData of testsData) {
    const test = await prisma.premaritalTest.create({
      data: {
        test_name: testData.name,
        description: testData.description,
      },
    });

    for (const [index, questionData] of testData.questions.entries()) {
      const question = await prisma.question.create({
        data: {
          question: questionData.question,
          type: questionData.type as QuestionType,
          question_no: index + 1,
          premarital_test_id: test.test_id,
        },
      });

      if (questionData.type !== 'TEXT') {
        await prisma.answer.createMany({
          data: questionData.options.map((answer, i) => ({
            question_id: question.question_id,
            answer,
            score: i + 1,
          })),
        });
      }
    }

    await prisma.therapyTest.create({
      data: {
        therapy_id: premaritalTherapy.therapy_id,
        test_id: test.test_id,
      },
    });
  }

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().then(() => {
      console.log('Disconnected from database');
    });
  });
