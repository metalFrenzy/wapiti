import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }
    async register(user: RegisterDto) {
        const existingUser = await this.userService.findByEmail(user.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await this.userService.create({
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
        })

        const token = this.generateToken(newUser.id, newUser.email)

        const { password, ...userWithoutPassword } = newUser;
        return {
            newUser: userWithoutPassword,
            access_token: token
        };
    }

    async login(user: LoginDto) {
        const exisitingUser = await this.userService.findByEmail(user.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(user.password, exisitingUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.generateToken(exisitingUser.id, exisitingUser.email);

        const { password, ...userWithoutPassword } = exisitingUser;
        return {
            user: userWithoutPassword,
            access_token: token
        };
    }




    generateToken(id: string, email: string) {
        const payLoade = { sub: id, email };
        return this.jwtService.sign(payLoade);
    }


}
