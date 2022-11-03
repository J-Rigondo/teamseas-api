import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MobileJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'mobile-jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //false -> JWT 만료 확인 및 401 예외 발생
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      logging: true,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    // console.log(req);
    console.log(payload);
    const refreshToken = req.headers.authorization.split(' ')[1];

    const user = await this.authService.verifyMobileRefreshToken(
      refreshToken,
      payload.id,
    );

    console.log('validate user', user);

    return user;
  }
}
