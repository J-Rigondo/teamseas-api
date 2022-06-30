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
  await prisma.$transaction(async (prisma) => {
    await prisma.donation.create({
      data: {
        count: 13,
        message: 'test donate',
        user: {
          connect: {
            id: 3,
          },
        },
      },
    });

    // await prisma.post.create({
    //   data: {
    //     title: 'text record3',
    //     author: {
    //       connect: {
    //         id: 4,
    //       },
    //     },
    //   },
    // });

    const result = await prisma.post.create({
      data: {
        title: 'test post',
        author: {
          connect: {
            id: 3,
          },
        },
      },
    });

    console.log(result);
    return result;
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
