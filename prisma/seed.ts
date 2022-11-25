import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
  const postPromises = [];

  // new Array(20).fill(0).forEach((_) => {
  //   postPromises.push(
  //     prisma.post.create({
  //       data: {
  //         title: faker.internet.userName(),
  //         content: `this is my description, ${faker.lorem.paragraph()} content`,
  //         author: {
  //           connect: {
  //             id: 1,
  //           },
  //         },
  //       },
  //     }),
  //   );
  // });
  //
  // const posts = await Promise.all(postPromises);
  // console.log(posts);

  const re = await prisma.reply.aggregate({
    _max: {
      groupNo: true,
    },
  });

  console.log(re);
}

main()
  .catch((e) => {
    console.log(`seed error!!!! -> ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
