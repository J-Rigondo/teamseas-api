import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import * as bcrypt from 'bcrypt';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserUpdateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-update.input';
import { UpdateUserInput } from 'src/users/dtos/update-user.input';

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

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return {
      refreshToken,
      domain: process.env.FRONT_END_DOMAIN,
      path: '/',
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_EXPIRATION) * 1000,
    };
  }

  async setUserRefreshToken(refreshToken: string, user: User) {
    const hashed = await hash(refreshToken, 10);
    const updateUserInput = new UpdateUserInput();
    updateUserInput.refreshToken = hashed;

    this.usersService.update(user.id, updateUserInput);
  }

  logout() {
    return {
      domain: process.env.FRONT_END_DOMAIN,
      path: '/',
      httpOnly: true,
      maxAge: 0,
    };
  }
}
