import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { UserEntity } from '../entity/user.entity';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User() user: UserEntity,@I18n() i18n: I18nContext) {
    return 'test'
  }
}
