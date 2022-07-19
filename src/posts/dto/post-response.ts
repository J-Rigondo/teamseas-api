import { PostEntity } from 'src/posts/entities/post.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostResponse {
  @Field(() => [PostEntity], { nullable: false })
  posts: PostEntity[];
  @Field(() => String, { nullable: true })
  nextId?: string;
}
