import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { UserService } from '../../user/services/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GenerateJwtTokenUtility } from '../utility/generateJwtToken.utility';
import * as bcrypt from 'bcrypt';
import {CustomHttpException} from "../../../common/exceptions/http.exception";
import {HttpStatusEnum} from "../../../common/enums/http-status.enum";

@Injectable()
export class RegisterService {
  constructor(
    private readonly userService: UserService ,
    private readonly jwtService: JwtService,
    private readonly generateJwtTokenUtility: GenerateJwtTokenUtility,
  ) {
  }

  async register(identifier: string, password: string, typeIdentifier: TypeIdentifierEnum): Promise<UserEntity> {
    let user: UserEntity | null = null;

    try {
      if (typeIdentifier === TypeIdentifierEnum.EMAIL) {
        user = await this.userService.findWithEmail(identifier);
      } else if (typeIdentifier === TypeIdentifierEnum.PHONE) {
        user = await this.userService.findWithPhone(identifier);
      } else if (typeIdentifier === TypeIdentifierEnum.USERNAME) {
        user = await this.userService.findWithUsername(identifier);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        user = null;
      } else {
        throw error;
      }
    }

    if (user) {
      throw new CustomHttpException('a_user_with_this_identifier_already_exists', HttpStatusEnum.BAD_REQUEST);
    }
    password = await bcrypt.hash(password, 10);

    if (typeIdentifier === TypeIdentifierEnum.EMAIL) {
      user = await this.userService.createWithEmail(identifier, password);
    } else if (typeIdentifier === TypeIdentifierEnum.PHONE) {
      user = await this.userService.createWithPhone(identifier, password);
    } else if (typeIdentifier === TypeIdentifierEnum.USERNAME) {
      user = await this.userService.createWithUsername(identifier, password);
    }

    user.token = this.generateJwtTokenUtility.generateJwtToken(this.jwtService, user);
    return user;
  }
}
