import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '2h' },
    })
  ],
  providers: [AuthService, JwtStrategy,],
  controllers: [AuthController],
  exports: [JwtStrategy]
})
export class AuthModule { }
