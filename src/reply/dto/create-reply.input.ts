import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReplyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  postId: number;
  @Field(() => Int, { nullable: true })
  parentId?: number;
  @Field(() => String, { nullable: true })
  content?: string;
}
