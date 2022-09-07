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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
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
      provider: '',
    };

    const accessToken = this.generateAccessToken(payload);
    const refeshTokenInfo = this.generateRefreshToken(payload);

    await this.setUserRefreshToken(refeshTokenInfo.refreshToken, user);

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

    const res = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashed,
      },
    });

    console.log('update res', res);
  }

  async verifyRefreshToken(
    refreshToken: string,
    payload: { sub: string; provider: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +payload.sub,
      },
    });

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async logout(user: User) {
    console.log('users', user);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: null,
      },
    });

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

  async kakaoLogin(provider: string, email: string, username: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const findMember = await prisma.user.findFirst({
        where: {
          email,
          provider,
        },
      });

      if (!findMember) {
        const createMember = await prisma.user.create({
          data: {
            email,
            name: username,
            role: 'ADMIN',
            provider,
          },
        });

        const payload = {
          email: createMember.email,
          sub: createMember.id,
          role: createMember.role,
          provider,
        };

        const refreshInfo = this.generateRefreshToken(payload);
        await this.setUserRefreshToken(refreshInfo.refreshToken, createMember);

        return refreshInfo;
      }

      const payload = {
        email: findMember.email,
        sub: findMember.id,
        role: findMember.role,
        provider,
      };

      const refreshInfo = this.generateRefreshToken(payload);
      await this.setUserRefreshToken(refreshInfo.refreshToken, findMember);

      return refreshInfo;
    });
  }

  checkRefreshToken(user: User) {
    const accessToken = this.generateAccessToken({
      username: user.name,
      sub: user.id,
    });

    return {
      accessToken,
      user: {
        username: 'jun',
      },
    };
  }
}
