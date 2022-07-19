import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { PostCount } from 'src/@generated/prisma-nestjs-graphql/post/post-count.output';

@ObjectType()
export class PostEntity {
  @Field(() => ID, { nullable: false })
  id!: number;

  @Field(() => String, { nullable: false })
  title!: string;

  @Field(() => String, { nullable: true })
  content!: string | null;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  published!: boolean;

  @Field(() => User, { nullable: false })
  author?: User;

  @Field(() => Int, { nullable: false })
  authorId!: number;

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  views!: number;

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  likes!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => [User], { nullable: true })
  favoritedBy?: Array<User>;

  @Field(() => PostCount, { nullable: false })
  _count?: PostCount;
}
