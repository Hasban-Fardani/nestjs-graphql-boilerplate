import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginResponse } from './types/login-response.type';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days expiration
    };
    return {
      success: true,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload)
    };
  }

  async refreshToken(user: any): Promise<LoginResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days for refresh token
    };
    return {
      success: true,
      message: 'Token refreshed',
      access_token: this.jwtService.sign(payload)
    };
  }

  async register(email: string, password: string): Promise<UserEntity> {
    const userData = await this.prisma.user.create({
      data: {
        email: email,
        password: await bcrypt.hash(password, 10),
      }
    })

    return userData
  }
}
