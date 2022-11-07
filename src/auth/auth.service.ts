import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UpdateUserInput } from 'src/users/dtos/update-user.input';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApolloError } from 'apollo-server-express';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refeshTokenInfo = this.generateRefreshToken(payload);

    //await this.setUserRefreshToken(refeshTokenInfo.refreshToken, user);

    return {
      accessToken,
      refeshTokenInfo,
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

  async verifyRefreshToken(refreshToken: string, id: number) {
    return;
  }

  logout() {
    return {
      domain: process.env.FRONT_END_DOMAIN,
      path: '/',
      httpOnly: true,
      maxAge: 0,
    };
  }

  //for graphql
  async googleLogin(tokenId: string) {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return;
  }

  kakaoLogin() {
    return;
  }

  checkRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      return new UnauthorizedException();
    }

    //confirm refresh token logic

    const payload = {
      email: 'futuregoing@kakao.com',
      sub: 1,
      role: 'ADMIN',
    };
    const accessToken = this.generateAccessToken(payload);

    return {
      accessToken,
      user: {
        username: 'jun',
      },
    };
  }

  mobileLogin(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return {
      user,
      accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  async verifyMobileRefreshToken(refreshToken: string, id) {
    console.log('in refrehs');
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    console.log(user);

    if (!user) {
      throw new ApolloError('user not found', '404');
    }

    // if (refreshToken !== user.refreshToken) {
    //   throw new ApolloError('token not matched', '404');
    // }

    return user;
  }

  //for graphql
  async mobileGoogleLogin(tokenId: string) {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log('ticket==', ticket);

    return;
  }
}
