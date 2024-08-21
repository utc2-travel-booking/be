import { LocalStrategy } from 'src/strategies/local.strategy';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { MetadataModule } from '../metadata/metadata.module';
import { appSettings } from 'src/configs/appsettings';
import { SuperCacheModule } from 'libs/super-cache/super-cache.module';
import { LoginTelegramProviderStrategy } from 'src/strategies/login-telegram-provider.strategy';
import { LoginTelegramMiniAppStrategy } from 'src/strategies/login-telegram-mini-app.strategy';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { UserPayloadExtractorStrategy } from 'src/strategies/user-payload-extractor.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: appSettings.jwt.secret,
            signOptions: {
                expiresIn: appSettings.jwt.expireIn,
                issuer: appSettings.jwt.issuer,
            },
        }),
        SuperCacheModule,
        UserModule,
        RolesModule,
        MetadataModule,
        TelegramBotModule,
    ],
    controllers: [],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        LoginTelegramProviderStrategy,
        LoginTelegramMiniAppStrategy,
        UserPayloadExtractorStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
