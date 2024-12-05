import { Module } from '@nestjs/common';
import { ConfigSetupModule } from "./configs/config.module";
import { CoreModule } from "./core/core.module";
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import {AuthModule} from "./modules/auth/auth.module";
import {UserModule} from "./modules/user/user.module";


@Module({
  imports: [
    ConfigSetupModule,
    CoreModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['lang']},
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
    UserModule
  ],
  providers: [],

})
export class AppModule {}
