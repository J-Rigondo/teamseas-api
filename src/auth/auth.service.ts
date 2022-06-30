import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import * as bcrypt from 'bcrypt';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const where = new UserWhereUniqueInput();
    where.email = email;

    const user = await this.usersService.findOne(where);

    if (!user) {
      return null;
    }

    //const hash = await bcrypt.hash(password, user.salt);
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user,
    };
  }
}
