import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //false -> JWT 만료 확인 및 401 예외 발생
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      logging: true,
    });
  }

  async validate(payload: any) {
    console.log(payload);

    const where = new UserWhereUniqueInput();
    where.id = payload.sub;

    const user = await this.usersService.findOne(where);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
