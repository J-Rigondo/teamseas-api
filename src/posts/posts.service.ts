import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponse } from 'src/posts/dto/post-response';
import { AsyncContextService } from 'src/async-context/async-context.service';

function ExecuteLogAspect() {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    console.log('=========================aop ExecuteLogAspect');
    const originMethod = desc.value;

    desc.value = async function (...args) {
      const res = await originMethod.apply(this, args);
      console.log('after execute method');
      console.log('==================exit');

      return res;
    };
  };
}

function ExecuteSendingAspect(
  target: any,
  key: string,
  desc: PropertyDescriptor,
) {
  console.log('=========sending aspect ==============');
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly asyncContext: AsyncContextService,
  ) {}

  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  @ExecuteLogAspect()
  @ExecuteSendingAspect
  async findAll(cursor: string) {
    const limit = 4;
    const cursorObj = cursor ? { id: +cursor } : undefined;

    console.log('asyc', this.asyncContext.get());

    const posts = await this.prisma.post.findMany({
      take: limit,
      cursor: cursorObj,
      skip: cursor ? 1 : 0, //커서가 없다면 시작점
      include: {
        author: true,
      },
    });

    const response = new PostResponse();
    response.posts = posts;
    response.nextId =
      posts.length === limit ? posts[limit - 1].id + '' : undefined;

    return response;
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
