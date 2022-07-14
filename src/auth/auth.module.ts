import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from 'src/auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    // UsersService,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
