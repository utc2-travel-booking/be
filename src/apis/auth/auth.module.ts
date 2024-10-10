import { LocalStrategy } from 'src/strategies/local.strategy';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MetadataModule } from '../metadata/metadata.module';
import { appSettings } from 'src/configs/app-settings';
import { RolesModule } from '@libs/super-authorize/modules/roles/roles.module';

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
    ],
    controllers: [],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
