import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';
import {  JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { RegisterController } from './controllers/register.controller';
import { RegisterService } from './services/register.service';
import { GenerateJwtTokenUtility } from './utility/generateJwtToken.utility';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [LoginController,RegisterController],
  providers: [LoginService,UserService,JwtService,RegisterService,GenerateJwtTokenUtility]
})
export class AuthModule {}
