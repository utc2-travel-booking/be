import { PermissionsModule } from './modules/permissions/permissions.module';
import { SuperAuthorizeService } from './super-authorize.service';
import { Module, DynamicModule } from '@nestjs/common';

@Module({
    imports: [PermissionsModule],
    controllers: [],
    providers: [SuperAuthorizeService],
    exports: [SuperAuthorizeService],
})
export class SuperAuthorizeModule {
    static forRoot(opstions: { prefixes: string[] }): DynamicModule {
        return {
            module: SuperAuthorizeModule,
            providers: [
                SuperAuthorizeService,
                {
                    provide: 'PREFIXES',
                    useValue: opstions.prefixes,
                },
            ],
            exports: ['PREFIXES'],
        };
    }
}
