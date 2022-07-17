import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/common/guard/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return res.redirect(process.env.FRONT_END_URL);
  }

  @Get('/kakao/login')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(@Req() req, @Res() res) {
    return res.redirect(process.env.FRONT_END_URL);
  }
}
