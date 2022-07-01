import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

// async function createUsers() {
//   const createMany = await prisma.user.createMany({
//     data: [
//       {
//         name: 'jun',
//         email: 'futuregoing@prismweaver.com',
//       },
//       {
//         name: 'chan',
//         email: 'chan@prismweaver.com',
//       },
//     ],
//     skipDuplicates: true,
//   });
//
//   const alice = await prisma.user.create({
//     data: {
//       name: 'alice',
//       email: 'alice@prismweaver.com',
//     },
//   });
//
//   const jane = await prisma.user.create({
//     data: {
//       name: 'jane',
//       email: 'alice@prismweaver.com',
//     },
//   });
// }

async function main() {
  // const result = await prisma.user.create({
  //   data: {
  //     email: 'f1@prw.com',
  //     name: 'f1',
  //     password: '1',
  //     role: 'USER',
  //     followers: {
  //       create: [
  //         { email: 'f2@prw.com', name: 'f2', password: '1', role: 'USER' },
  //         { email: 'f3@prw.com', name: 'f3', password: '1', role: 'USER' },
  //       ],
  //     },
  //   },
  // });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
