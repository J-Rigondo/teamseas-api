import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostEntity } from 'src/posts/entities/post.entity';
import { PostResponse } from 'src/posts/dto/post-response';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Role } from 'src/@generated/prisma-nestjs-graphql/prisma/role.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => PostEntity)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Query(() => PostResponse, { name: 'posts' })
  findAll(
    @Args('cursor', { type: () => String, nullable: true }) cursor: string,
  ) {
    return this.postsService.findAll(cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PostEntity, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => PostEntity)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => PostEntity)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
