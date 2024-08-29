import { PermissionsModule } from './modules/permissions/permissions.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SuperAuthorizeService } from './super-authorize.service';
import { Module, DynamicModule } from '@nestjs/common';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { RolesModule } from './modules/roles/roles.module';

export interface SuperAuthorizeOptions {
    paths: string[];
    jwt: {
        secret: string;
        issuer: string;
        expiresIn: string;
    };
}

@Module({
    imports: [PermissionsModule, RolesModule, SuperCacheModule],
    controllers: [],
    providers: [SuperAuthorizeService, JwtStrategy],
    exports: [SuperAuthorizeService],
})
export class SuperAuthorizeModule {
    static forRoot(options: SuperAuthorizeOptions): DynamicModule {
        return {
            module: SuperAuthorizeModule,
            providers: [
                SuperAuthorizeService,
                {
                    provide: 'SUPER_AUTHORIZE_OPTIONS',
                    useValue: options,
                },
            ],
            exports: ['SUPER_AUTHORIZE_OPTIONS'],
        };
    }
}
