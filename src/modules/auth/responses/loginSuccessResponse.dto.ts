import {ApiProperty, OmitType} from '@nestjs/swagger';
import {UserEntity} from "../../user/entity/user.entity";

export class LoginSuccessResponseDto extends OmitType(UserEntity, ['password', 'createdAt', 'updatedAt'] as const) {

}
