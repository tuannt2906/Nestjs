import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.testData.deleteMany();
  await prisma.testData.createMany({
    data: [
      { id: 1, date: new Date('2024-08-22T19:14:45Z'), message: '[TEST]' },
      { id: 2, date: new Date('2024-08-22T18:14:15Z'), message: '[TEST]' },
      { id: 3, date: new Date('2024-08-22T18:12:44Z'), message: '[TEST]' },
      { id: 4, date: new Date('2024-08-22T17:54:48Z'), message: '[TEST]' },
      { id: 5, date: new Date('2024-08-22T17:44:45Z'), message: '[TEST]' },
      { id: 6, date: new Date('2024-08-22T17:33:01Z'), message: '[TEST]' },
      { id: 7, date: new Date('2024-08-22T17:14:22Z'), message: '[TEST]' },
      { id: 8, date: new Date('2024-08-22T16:35:06Z'), message: '[TEST]' },
      { id: 9, date: new Date('2024-08-22T16:23:13Z'), message: '[TEST]' },
      { id: 10, date: new Date('2024-08-22T16:14:14Z'), message: '[TEST]' },
      { id: 11, date: new Date('2024-08-22T16:14:14Z'), message: '[TEST]' },
      { id: 12, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 13, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 14, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 15, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 16, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 17, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 18, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 19, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 20, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 21, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
      { id: 22, date: new Date('2024-08-22T15:15:15Z'), message: '[TEST]' },
    ],
  });
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
