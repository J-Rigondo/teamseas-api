import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/common/guard/google-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return HttpStatus.OK;
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res) {
    return res.redirect('http://localhost:3000/');
  }
}
