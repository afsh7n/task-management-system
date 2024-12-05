import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/entity/user.entity';
import { UserPayload } from '../types/userPayload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateJwtTokenUtility {

  constructor(private configService: ConfigService) {
  }

  /**
   * Generates a JWT token for the user
   * @param jwtService
   * @param user - The user entity for which the token is generated
   * @returns The generated JWT token
   */
  public generateJwtToken(jwtService: JwtService,user: UserEntity): string {
    const payload: UserPayload = {
      id: +user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
    };
    return jwtService.sign(payload,{
      secret: this.configService.get<string>('jwt.JWT_SECRET') || 'mySuperSecretKey',
    });
  }
}
