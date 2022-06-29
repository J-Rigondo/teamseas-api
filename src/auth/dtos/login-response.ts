import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  user: User;
}
