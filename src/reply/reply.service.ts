import { Injectable } from '@nestjs/common';
import { CreateReplyInput } from './dto/create-reply.input';
import { UpdateReplyInput } from './dto/update-reply.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@Injectable()
export class ReplyService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createReplyInput: CreateReplyInput, user: User) {
    return await this.prisma.$transaction(async (prisma) => {
      const { parentId, postId, content } = createReplyInput;

      //first reply
      if (!parentId) {
        //find max groupNo
        const {
          _max: { groupNo: maxGroupNo },
        } = await prisma.reply.aggregate({
          _max: {
            groupNo: true,
          },
        });

        return await prisma.reply.create({
          data: {
            post: { connect: { id: postId } },
            author: { connect: { id: user.id } },
            groupNo: maxGroupNo ? maxGroupNo + 1 : 1,
            content,
          },
        });
      }

      const parent = await prisma.reply.findUnique({
        where: {
          id: parentId,
        },
      });

      const { groupNo, depth, groupOrder, childCount } = parent;

      //re-reply
      if (groupOrder === 0) {
        const {
          _max: { groupOrder: maxGroupOrder },
        } = await prisma.reply.aggregate({
          _max: {
            groupOrder: true,
          },
          where: {
            groupNo,
          },
        });

        await prisma.reply.update({
          where: {
            id: parentId,
          },
          data: {
            childCount: {
              increment: 1,
            },
          },
        });

        return await prisma.reply.create({
          data: {
            post: { connect: { id: postId } },
            author: { connect: { id: user.id } },
            content,
            groupNo,
            depth: depth + 1,
            groupOrder: maxGroupOrder + 1,
            parent: {
              connect: { id: parentId },
            },
          },
        });
      }

      //re-re-reply
      //first
      if (childCount === 0) {
        await prisma.reply.update({
          where: {
            id: parentId,
          },
          data: {
            childCount: {
              increment: 1,
            },
          },
        });

        await prisma.reply.updateMany({
          where: {
            groupOrder: {
              gt: groupOrder,
            },
          },
          data: {
            groupOrder: {
              increment: 1,
            },
          },
        });

        return await prisma.reply.create({
          data: {
            post: { connect: { id: postId } },
            author: { connect: { id: user.id } },
            content,
            groupNo,
            depth: depth + 1,
            groupOrder: groupOrder + 1,
            parent: {
              connect: { id: parentId },
            },
          },
        });
      }

      if (childCount > 0) {
        await prisma.reply.updateMany({
          where: {
            groupOrder: {
              gt: groupOrder + childCount,
            },
          },
          data: {
            groupOrder: {
              increment: 1,
            },
          },
        });

        await prisma.reply.update({
          where: {
            id: parentId,
          },
          data: {
            childCount: {
              increment: 1,
            },
          },
        });

        return await prisma.reply.create({
          data: {
            post: { connect: { id: postId } },
            author: { connect: { id: user.id } },
            content,
            groupNo,
            depth: depth + 1,
            groupOrder: groupOrder + childCount + 1,
            parent: {
              connect: { id: parentId },
            },
          },
        });
      }
    });
  }

  findAll() {
    return `This action returns all reply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  update(id: number, updateReplyInput: UpdateReplyInput) {
    return `This action updates a #${id} reply`;
  }

  remove(id: number) {
    return `This action removes a #${id} reply`;
  }

  async findAllParentReply(postId: number) {
    return await this.prisma.reply.findMany({
      where: {
        postId,
        parentId: null,
      },
    });
  }
}
