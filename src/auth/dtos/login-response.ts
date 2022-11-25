import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: false })
  accessToken: string;
  @Field(() => String, { nullable: false })
  refreshToken: string;

  // @Field(() => String, { nullable: false })
  // user: User;
}
