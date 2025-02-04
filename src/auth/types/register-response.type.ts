import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../../common/types/base-response.type';

@ObjectType({ description: 'Response after login attempt' })
export class RegisterResponse extends BaseResponse {
  @Field(() => String)
  user?: string;
}
