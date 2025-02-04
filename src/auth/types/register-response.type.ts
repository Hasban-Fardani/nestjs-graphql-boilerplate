import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../../common/types/base-response.type';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType({ description: 'Response after login attempt' })
export class RegisterResponse extends BaseResponse {
  @Field(() => String)
  user?: UserEntity;
}
