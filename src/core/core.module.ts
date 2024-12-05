import { Module } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.setup';
import { LoggerService } from "./logger/logger.service";
import { DatabaseModule } from "./database/database.module";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global:true,
          secret: configService.get<string>('jwt.JWT_SECRET') || 'mySuperSecretKey',
          secretOrPrivateKey: configService.get<string>('jwt.JWT_SECRET') || 'mySuperSecretKey',
          signOptions: { expiresIn: configService.get<string>('jwt.JWT_EXPIRES_IN') || '3600s' },
        }
      },
    }),
  ],
  providers:[LoggerService],
  exports:[LoggerService],
})
export class CoreModule {
  static configureSwagger(app: any): void {
    setupSwagger(app);
  }
}
