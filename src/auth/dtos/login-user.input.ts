import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field(() => String, { nullable: false, description: '이메일' })
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
