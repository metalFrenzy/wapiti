import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    async register(@Body() user: RegisterDto) {
        return this.authService.register(user);
    }

    @Post('login')
    async login(@Body() user: LoginDto) {
        return this.authService.login(user);
    }
}
