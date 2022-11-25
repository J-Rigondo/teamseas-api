import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { CreateReplyInput } from './dto/create-reply.input';
import { UpdateReplyInput } from './dto/update-reply.input';
import { Reply } from 'src/@generated/prisma-nestjs-graphql/reply/reply.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Resolver(() => Reply)
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Mutation(() => Reply)
  @UseGuards(JwtAuthGuard)
  createReply(
    @Args('createReplyInput') createReplyInput: CreateReplyInput,
    @Context() context,
  ) {
    return this.replyService.create(createReplyInput, context.req.user);
  }

  @Query(() => [Reply])
  findAllParentReply(@Args('postId', { type: () => Int }) postId: number) {
    return this.replyService.findAllParentReply(postId);
  }

  @Query(() => [Reply], { name: 'reply' })
  findAll() {
    return this.replyService.findAll();
  }

  @Query(() => Reply, { name: 'reply' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.replyService.findOne(id);
  }

  @Mutation(() => Reply)
  updateReply(@Args('updateReplyInput') updateReplyInput: UpdateReplyInput) {
    return this.replyService.update(updateReplyInput.id, updateReplyInput);
  }

  @Mutation(() => Reply)
  removeReply(@Args('id', { type: () => Int }) id: number) {
    return this.replyService.remove(id);
  }
}
