import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from 'src/auth/dtos/login-user.input';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const where = new UserWhereUniqueInput();
    where.email = email;

    const user = await this.usersService.findOne(where);

    if (!user) {
      return null;
    }

    const hash = await bcrypt.hash(password, user.salt);
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(loginUserInput: LoginUserInput) {
    const where = new UserWhereUniqueInput();
    where.email = loginUserInput.email;

    const user = await this.usersService.findOne(where);

    return {
      accessToken: 'jwt',
      user,
    };
  }
}
