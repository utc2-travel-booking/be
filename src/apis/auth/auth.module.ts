import { LocalStrategy } from 'src/strategies/local.strategy';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MetadataModule } from '../metadata/metadata.module';
import { appSettings } from 'src/configs/app-settings';
import { LoginTelegramProviderStrategy } from 'src/strategies/login-telegram-provider.strategy';
import { LoginTelegramMiniAppStrategy } from 'src/strategies/login-telegram-mini-app.strategy';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { UserPayloadExtractorStrategy } from 'src/strategies/user-payload-extractor.strategy';
import { RolesModule } from '@libs/super-authorize/modules/roles/roles.module';
import { MissionModule } from '../mission/mission.module';

@Module({
    imports: [
        JwtModule.register({
            secret: appSettings.jwt.secret,
            signOptions: {
                expiresIn: appSettings.jwt.expireIn,
                issuer: appSettings.jwt.issuer,
            },
        }),
        UserModule,
        RolesModule,
        MetadataModule,
        TelegramBotModule,
        MissionModule,
    ],
    controllers: [],
    providers: [
        AuthService,
        LocalStrategy,
        LoginTelegramProviderStrategy,
        LoginTelegramMiniAppStrategy,
        UserPayloadExtractorStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
