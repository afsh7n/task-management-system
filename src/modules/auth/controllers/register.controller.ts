import {BadRequestException, Body, Controller, HttpCode, Post} from '@nestjs/common';
import { LoginDto } from '../dto/login/login.dto';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { CheckIdentifier } from '../utility/checkIdentifier.utility';
import {ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiProduces} from '@nestjs/swagger';
import { RegisterDto } from '../dto/register/register.dto';
import { RegisterService } from '../services/register.service';
import {UserEntity} from "../../user/entity/user.entity";
import {GlobalApiResponses} from "../../../common/decorators/globalApiResponses.decorator";
import {LoginSuccessResponseDto} from "../responses/loginSuccessResponse.dto";
import {ErrorResponseDto} from "../../../common/dto/errorResponse.dto";

@Controller('auth')
@GlobalApiResponses()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User Register',
    description: 'Logs the user into the system using identifier and password.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    description: 'Register credentials containing identifier and password.',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Register successful.',
    type:LoginSuccessResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials or input data.',
    type: ErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    if (registerDto.identifier.startsWith('09')) {
      registerDto.identifier =  registerDto.identifier.replace(/^09/, '989');
    }
    registerDto.identifier =  registerDto.identifier.replace('+', '');
    const typeIdentifier: TypeIdentifierEnum = CheckIdentifier.identify(registerDto.identifier);
    return this.registerService.register(registerDto.identifier, registerDto.password, typeIdentifier);
  }
}
