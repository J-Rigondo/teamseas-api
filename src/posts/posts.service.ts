import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponse } from 'src/posts/dto/post-response';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  async findAll(cursor: string) {
    const limit = 4;
    const cursorObj = cursor ? { id: +cursor } : undefined;

    const posts = await this.prisma.post.findMany({
      take: limit,
      cursor: cursorObj,
      skip: cursor ? 1 : 0, //커서가 없다면 시작점
      include: {
        author: true,
      },
    });

    console.log(posts);

    const response = new PostResponse();
    response.posts = posts;
    response.nextId =
      posts.length === limit ? posts[limit - 1].id + '' : undefined;

    console.log(response);

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
