import { Module } from '@nestjs/common';
import { ConfigSetupModule } from "./configs/config.module";
import { CoreModule } from "./core/core.module";
import * as path from 'path';
import {AuthModule} from "./modules/auth/auth.module";
import {UserModule} from "./modules/user/user.module";
import {TasksModule} from "./modules/tasks/tasks.module";


@Module({
  imports: [
    ConfigSetupModule,
    CoreModule,
    AuthModule,
    UserModule,
    TasksModule
  ],
  providers: [],

})
export class AppModule {}
