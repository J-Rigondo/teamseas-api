import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field(() => String, { nullable: false, description: '이메일' })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: false, description: '비밀번호' })
  password: string;
}
