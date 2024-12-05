import {BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException} from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { LoginDto } from '../dto/login/login.dto';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { CheckIdentifier } from '../utility/checkIdentifier.utility';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import {UserEntity} from "../../user/entity/user.entity";
import {GlobalApiResponses} from "../../../common/decorators/globalApiResponses.decorator";

@Controller('auth')
@GlobalApiResponses()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User Login',
    description: 'Logs the user into the system using identifier and password.',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Login credentials containing identifier and password.',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: UserEntity,
  })
  async login(@Body() loginDto: LoginDto) {
    const typeIdentifier: TypeIdentifierEnum = CheckIdentifier.identify(loginDto.identifier);
    return this.loginService.login(loginDto.identifier, loginDto.password, typeIdentifier);
  }
}
