import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@ObjectType()
export class MobileLoginResponse {
  @Field()
  user: User;

  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}
