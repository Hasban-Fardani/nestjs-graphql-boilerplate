import { Injectable, NotFoundException, createParamDecorator } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { RegisterInput } from '../auth/inputs/register.input';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}

  async findOne(id: string): Promise<void | UserEntity> {
    const user = this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found')
    }
  }

  async findByEmail(email: string): Promise<void | UserEntity> {
    const user = this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User Not Found')
    }
  }
}
