import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Redirect,
  Param,
  Query,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/common/guard/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, tap } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refeshTokenInfo } = await this.authService.login(
      req.user,
    );

    const { refreshToken, ...options } = refeshTokenInfo;
    res.cookie('refresh', refreshToken, options);

    return {
      accessToken,
      user: req.user,
    };
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return HttpStatus.OK;
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res) {
    return res.redirect(`${process.env.FRONT_END_URL}/1`);
  }

  @Get('/token/:id')
  getToken(@Param('id') id: string) {
    console.log(id);
    return { accessToken: 'test', user: { username: 'jun' } };
  }

  @Get('/kakao/login')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      provider,
      id,
      username,
      _json: {
        kakao_account: { email },
      },
    } = req.user;

    console.log(provider, id, username, email);

    this.authService.kakaoLogin();

    res.cookie('refresh', 'kakao login cookie test', {
      domain: process.env.FRONT_END_DOMAIN,
      path: '/',
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_EXPIRATION) * 1000,
    });

    res.redirect(process.env.FRONT_END_URL);

    // const {
    //   query: { code },
    // } = req;
    //
    // console.log('in callback');
    //
    // return res.redirect(
    //   `${process.env.FRONT_END_URL}/kakao/callback/?code=${code}`,
    // );
  }

  @Get('/refresh')
  async checkRefreshToken(@Req() req) {
    console.log(req.cookies);
    const { refresh } = req.cookies;

    const result = this.authService.checkRefreshToken(refresh);

    return result;
  }

  @Post('/kakao/login/msa')
  async kakaoLoginMsa(@Body() body) {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    let result;

    try {
      result = await lastValueFrom(
        await this.httpService
          .post(
            'https://kauth.kakao.com/oauth/token',
            {
              grant_type: 'authorization_code',
              client_id: process.env.KAKAO_CLIENT_ID,
              redirect_uri: 'http://localhost:4000/auth/kakao/callback',
              code: body.code,
            },
            config,
          )
          .pipe(map((res) => res.data)),
      );
    } catch (e) {
      console.log(e);
    }

    return result;
  }
}
