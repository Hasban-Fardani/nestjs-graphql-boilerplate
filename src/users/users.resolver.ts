import { LoggerService, UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/qgl-auth.guard';
import { GqlThrottlerGuard } from '../common/guards/throttler-gql.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
@UseGuards(GqlThrottlerGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private loggerService: LoggerService
  ) {}

  @Query(() => UserEntity, { 
    name: 'currentUser',
    description: 'Get current user data. Requires Authorization header with Bearer token.'
  })
  @UseGuards(GqlAuthGuard)
  getCurrentUser(@CurrentUser() user: UserEntity): Promise<void | UserEntity> {
    const selectedUser = this.usersService.findOne(user.id);

    if (!selectedUser) {
      throw new Error('User not found');
    }
    
    this.loggerService.log('usernya nih: ', selectedUser)
    return selectedUser;
  }
}
