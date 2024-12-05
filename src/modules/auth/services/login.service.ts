import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { UserService } from '../../user/services/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GenerateJwtTokenUtility } from '../utility/generateJwtToken.utility';
import {CustomHttpException} from "../../../common/exceptions/http.exception";
import {HttpStatusEnum} from "../../../common/enums/http-status.enum";

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService ,
    private readonly jwtService: JwtService,
    private readonly generateJwtTokenUtility: GenerateJwtTokenUtility
  ) {
  }

  async login(identifier: string, password: string, typeIdentifier: TypeIdentifierEnum) {
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

    if (!user) {
      throw new CustomHttpException('auth.is_not_correct',HttpStatusEnum.UNAUTHORIZED);
    }

    // Validate the password
    if (!await this.validationPasswordUser(user,password)){
      throw new CustomHttpException('auth.invalid_identifier_or_password',HttpStatusEnum.UNAUTHORIZED);
    }


    // Generate and return the JWT token
    user.token = this.generateJwtTokenUtility.generateJwtToken(this.jwtService, user);
    return user
  }

  private async validationPasswordUser(user : UserEntity, password: string) : Promise<boolean>{
    return bcrypt.compare(password, user.password);
  }
}
